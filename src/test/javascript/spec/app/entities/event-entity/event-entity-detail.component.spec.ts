/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { GramatikTestModule } from '../../../test.module';
import { EventEntityDetailComponent } from '../../../../../../main/webapp/app/entities/event-entity/event-entity-detail.component';
import { EventEntityService } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.service';
import { EventEntity } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.model';

describe('Component Tests', () => {

    describe('EventEntity Management Detail Component', () => {
        let comp: EventEntityDetailComponent;
        let fixture: ComponentFixture<EventEntityDetailComponent>;
        let service: EventEntityService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GramatikTestModule],
                declarations: [EventEntityDetailComponent],
                providers: [
                    EventEntityService
                ]
            })
            .overrideTemplate(EventEntityDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntityDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntityService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new EventEntity(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.eventEntity).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
