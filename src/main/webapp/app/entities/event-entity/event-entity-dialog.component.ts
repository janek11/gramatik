import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { EventEntity } from './event-entity.model';
import { EventEntityPopupService } from './event-entity-popup.service';
import { EventEntityService } from './event-entity.service';
import { User, UserService } from '../../shared';

@Component({
    selector: 'jhi-event-entity-dialog',
    templateUrl: './event-entity-dialog.component.html'
})
export class EventEntityDialogComponent implements OnInit {

    eventEntity: EventEntity;
    isSaving: boolean;

    users: User[];
    creationDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private eventEntityService: EventEntityService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: HttpResponse<User[]>) => { this.users = res.body; }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.eventEntity.id !== undefined) {
            this.subscribeToSaveResponse(
                this.eventEntityService.update(this.eventEntity));
        } else {
            this.subscribeToSaveResponse(
                this.eventEntityService.create(this.eventEntity));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<EventEntity>>) {
        result.subscribe((res: HttpResponse<EventEntity>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: EventEntity) {
        this.eventManager.broadcast({ name: 'eventEntityListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-event-entity-popup',
    template: ''
})
export class EventEntityPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEntityPopupService: EventEntityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.eventEntityPopupService
                    .open(EventEntityDialogComponent as Component, params['id']);
            } else {
                this.eventEntityPopupService
                    .open(EventEntityDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
