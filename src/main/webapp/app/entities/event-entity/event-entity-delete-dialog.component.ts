import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { EventEntity } from './event-entity.model';
import { EventEntityPopupService } from './event-entity-popup.service';
import { EventEntityService } from './event-entity.service';

@Component({
    selector: 'jhi-event-entity-delete-dialog',
    templateUrl: './event-entity-delete-dialog.component.html'
})
export class EventEntityDeleteDialogComponent {

    eventEntity: EventEntity;

    constructor(
        private eventEntityService: EventEntityService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.eventEntityService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'eventEntityListModification',
                content: 'Deleted an eventEntity'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-entity-delete-popup',
    template: ''
})
export class EventEntityDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private eventEntityPopupService: EventEntityPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.eventEntityPopupService
                .open(EventEntityDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
