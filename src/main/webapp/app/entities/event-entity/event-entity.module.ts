import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GramatikSharedModule } from '../../shared';
import { GramatikAdminModule } from '../../admin/admin.module';
import {
    EventEntityService,
    EventEntityPopupService,
    EventEntityComponent,
    EventEntityDetailComponent,
    EventEntityDialogComponent,
    EventEntityPopupComponent,
    EventEntityDeletePopupComponent,
    EventEntityDeleteDialogComponent,
    eventEntityRoute,
    eventEntityPopupRoute,
} from './';

const ENTITY_STATES = [
    ...eventEntityRoute,
    ...eventEntityPopupRoute,
];

@NgModule({
    imports: [
        GramatikSharedModule,
        GramatikAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        EventEntityComponent,
        EventEntityDetailComponent,
        EventEntityDialogComponent,
        EventEntityDeleteDialogComponent,
        EventEntityPopupComponent,
        EventEntityDeletePopupComponent,
    ],
    entryComponents: [
        EventEntityComponent,
        EventEntityDialogComponent,
        EventEntityPopupComponent,
        EventEntityDeleteDialogComponent,
        EventEntityDeletePopupComponent,
    ],
    providers: [
        EventEntityService,
        EventEntityPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GramatikEventEntityModule {}
