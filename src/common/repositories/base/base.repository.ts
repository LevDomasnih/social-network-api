import { BaseEntity } from './base.entity';
import { EntityManager, getManager, Repository } from 'typeorm';
import { BaseInterface } from './base.interface';

export class BaseRepository<T extends BaseEntity> extends Repository<T> implements BaseInterface<T> {
    protected readonly db: EntityManager;

    constructor() {
        super();
        this.db = getManager();
    }
}
