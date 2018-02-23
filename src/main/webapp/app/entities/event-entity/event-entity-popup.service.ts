import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { EventEntity } from './event-entity.model';
import { EventEntityService } from './event-entity.service';

@Injectable()
export class EventEntityPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private eventEntityService: EventEntityService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.eventEntityService.find(id)
                    .subscribe((eventEntityResponse: HttpResponse<EventEntity>) => {
                        const eventEntity: EventEntity = eventEntityResponse.body;
                        if (eventEntity.creationDate) {
                            eventEntity.creationDate = {
                                year: eventEntity.creationDate.getFullYear(),
                                month: eventEntity.creationDate.getMonth() + 1,
                                day: eventEntity.creationDate.getDate()
                            };
                        }
                        this.ngbModalRef = this.eventEntityModalRef(component, eventEntity);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.eventEntityModalRef(component, new EventEntity());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    eventEntityModalRef(component: Component, eventEntity: EventEntity): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.eventEntity = eventEntity;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
