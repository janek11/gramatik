import { BaseEntity, User } from './../../shared';

export class EventEntity implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public creationDate?: any,
        public user?: User,
    ) {
    }
}
