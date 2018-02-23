import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { EventEntityComponent } from './event-entity.component';
import { EventEntityDetailComponent } from './event-entity-detail.component';
import { EventEntityPopupComponent } from './event-entity-dialog.component';
import { EventEntityDeletePopupComponent } from './event-entity-delete-dialog.component';

export const eventEntityRoute: Routes = [
    {
        path: 'event-entity',
        component: EventEntityComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gramatikApp.eventEntity.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'event-entity/:id',
        component: EventEntityDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gramatikApp.eventEntity.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const eventEntityPopupRoute: Routes = [
    {
        path: 'event-entity-new',
        component: EventEntityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gramatikApp.eventEntity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-entity/:id/edit',
        component: EventEntityPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gramatikApp.eventEntity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'event-entity/:id/delete',
        component: EventEntityDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'gramatikApp.eventEntity.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
