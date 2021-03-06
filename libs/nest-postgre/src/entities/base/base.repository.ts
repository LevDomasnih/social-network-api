import { DeepPartial, EntityManager, getManager, Repository } from 'typeorm';
import { SaveOptions } from 'typeorm/repository/SaveOptions';
import { BadRequestException } from '@nestjs/common';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { BaseInterface, BaseModel } from '@app/nest-postgre/entities';

export class BaseRepository<T extends BaseModel> extends Repository<T> implements BaseInterface<T> {
    protected readonly db: EntityManager;

    constructor() {
        super();
        this.db = getManager();
    }

    async saveAndGet(entity: DeepPartial<T>, options?: SaveOptions, findOptions?: FindOneOptions<T>): Promise<T> {
        const save = await this.save(entity, options);
        const findEntity = await this.findOne(save.id, findOptions);
        if (!findEntity) {
            throw new BadRequestException('Сущность не найдена')
        }
        return findEntity
    }
}
