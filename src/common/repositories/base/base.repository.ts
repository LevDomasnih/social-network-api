import { BaseEntity } from './base.entity';
import { Repository } from 'typeorm';
import { BaseInterface } from './base.interface';

export class BaseRepository<T extends BaseEntity> extends Repository<T> implements BaseInterface {

}
