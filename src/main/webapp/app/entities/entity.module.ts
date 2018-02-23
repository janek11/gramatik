import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { GramatikEventEntityModule } from './event-entity/event-entity.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        GramatikEventEntityModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GramatikEntityModule {}
