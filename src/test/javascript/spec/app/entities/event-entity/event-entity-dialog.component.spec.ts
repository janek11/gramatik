/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { JhiEventManager } from 'ng-jhipster';

import { GramatikTestModule } from '../../../test.module';
import { EventEntityDialogComponent } from '../../../../../../main/webapp/app/entities/event-entity/event-entity-dialog.component';
import { EventEntityService } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.service';
import { EventEntity } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.model';
import { UserService } from '../../../../../../main/webapp/app/shared';

describe('Component Tests', () => {

    describe('EventEntity Management Dialog Component', () => {
        let comp: EventEntityDialogComponent;
        let fixture: ComponentFixture<EventEntityDialogComponent>;
        let service: EventEntityService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GramatikTestModule],
                declarations: [EventEntityDialogComponent],
                providers: [
                    UserService,
                    EventEntityService
                ]
            })
            .overrideTemplate(EventEntityDialogComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntityDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntityService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('save', () => {
            it('Should call update service on save for existing entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new EventEntity(123);
                        spyOn(service, 'update').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.eventEntity = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.update).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'eventEntityListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );

            it('Should call create service on save for new entity',
                inject([],
                    fakeAsync(() => {
                        // GIVEN
                        const entity = new EventEntity();
                        spyOn(service, 'create').and.returnValue(Observable.of(new HttpResponse({body: entity})));
                        comp.eventEntity = entity;
                        // WHEN
                        comp.save();
                        tick(); // simulate async

                        // THEN
                        expect(service.create).toHaveBeenCalledWith(entity);
                        expect(comp.isSaving).toEqual(false);
                        expect(mockEventManager.broadcastSpy).toHaveBeenCalledWith({ name: 'eventEntityListModification', content: 'OK'});
                        expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    })
                )
            );
        });
    });

});
