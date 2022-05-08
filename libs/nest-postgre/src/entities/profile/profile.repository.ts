import { ProfileEntity } from './profile.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository, ProfileRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(ProfileEntity)
export class ProfileRepository extends BaseRepository<ProfileEntity> implements ProfileRepositoryInterface {}
