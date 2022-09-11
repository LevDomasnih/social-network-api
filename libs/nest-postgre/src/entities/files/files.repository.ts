import { FilesEntity } from './files.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository, FilesRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(FilesEntity)
export class FilesRepository extends BaseRepository<FilesEntity> implements FilesRepositoryInterface {
    async getFilePath(id: string) {
        const file = await this.findOne(id);
        return file?.getFilePath() || null;
    }

    async getFile(id: string) {
        return this.findOne(id, { relations: ['owner'] });
    }
}
