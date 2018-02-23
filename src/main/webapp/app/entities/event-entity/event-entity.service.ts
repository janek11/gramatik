import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { JhiDateUtils } from 'ng-jhipster';

import { EventEntity } from './event-entity.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<EventEntity>;

@Injectable()
export class EventEntityService {

    private resourceUrl =  SERVER_API_URL + 'api/event-entities';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) { }

    create(eventEntity: EventEntity): Observable<EntityResponseType> {
        const copy = this.convert(eventEntity);
        return this.http.post<EventEntity>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(eventEntity: EventEntity): Observable<EntityResponseType> {
        const copy = this.convert(eventEntity);
        return this.http.put<EventEntity>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<EventEntity>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<EventEntity[]>> {
        const options = createRequestOption(req);
        return this.http.get<EventEntity[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<EventEntity[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: EventEntity = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<EventEntity[]>): HttpResponse<EventEntity[]> {
        const jsonResponse: EventEntity[] = res.body;
        const body: EventEntity[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to EventEntity.
     */
    private convertItemFromServer(eventEntity: EventEntity): EventEntity {
        const copy: EventEntity = Object.assign({}, eventEntity);
        copy.creationDate = this.dateUtils
            .convertLocalDateFromServer(eventEntity.creationDate);
        return copy;
    }

    /**
     * Convert a EventEntity to a JSON which can be sent to the server.
     */
    private convert(eventEntity: EventEntity): EventEntity {
        const copy: EventEntity = Object.assign({}, eventEntity);
        copy.creationDate = this.dateUtils
            .convertLocalDateToServer(eventEntity.creationDate);
        return copy;
    }
}
