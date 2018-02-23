/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GramatikTestModule } from '../../../test.module';
import { EventEntityComponent } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.component';
import { EventEntityService } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.service';
import { EventEntity } from '../../../../../../main/webapp/app/entities/event-entity/event-entity.model';

describe('Component Tests', () => {

    describe('EventEntity Management Component', () => {
        let comp: EventEntityComponent;
        let fixture: ComponentFixture<EventEntityComponent>;
        let service: EventEntityService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [GramatikTestModule],
                declarations: [EventEntityComponent],
                providers: [
                    EventEntityService
                ]
            })
            .overrideTemplate(EventEntityComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(EventEntityComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(EventEntityService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new EventEntity(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.eventEntities[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
