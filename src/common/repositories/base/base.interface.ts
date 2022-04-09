import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { DeepPartial } from 'typeorm';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export interface BaseInterface<T> {
    saveAndGet(entity: DeepPartial<T>, options?: SaveOptions, findOptions?: FindOneOptions<T>): Promise<T>
}
