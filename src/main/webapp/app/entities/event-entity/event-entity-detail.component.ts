import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { EventEntity } from './event-entity.model';
import { EventEntityService } from './event-entity.service';

@Component({
    selector: 'jhi-event-entity-detail',
    templateUrl: './event-entity-detail.component.html'
})
export class EventEntityDetailComponent implements OnInit, OnDestroy {

    eventEntity: EventEntity;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private eventEntityService: EventEntityService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInEventEntities();
    }

    load(id) {
        this.eventEntityService.find(id)
            .subscribe((eventEntityResponse: HttpResponse<EventEntity>) => {
                this.eventEntity = eventEntityResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInEventEntities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'eventEntityListModification',
            (response) => this.load(this.eventEntity.id)
        );
    }
}
