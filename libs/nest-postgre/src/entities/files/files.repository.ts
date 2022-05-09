import { FilesEntity } from './files.entity'
import { EntityRepository } from 'typeorm';
import { BaseRepository, FilesRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(FilesEntity)
export class FilesRepository extends BaseRepository<FilesEntity> implements FilesRepositoryInterface {

}
