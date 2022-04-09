import { BaseRepository } from '../../common/repositories/base/base.repository';
import { ProfileEntity } from './profile.entity';
import { ProfileRepositoryInterface } from './interfaces/profile-repository.interface';
import { EntityRepository } from 'typeorm';

@EntityRepository(ProfileEntity)
export class ProfileRepository extends BaseRepository<ProfileEntity> implements ProfileRepositoryInterface {}
