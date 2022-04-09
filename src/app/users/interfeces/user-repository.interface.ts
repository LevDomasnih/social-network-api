import { FindConditions } from 'typeorm/find-options/FindConditions';
import { UserEntity } from '../user.entity';
import { FollowUsersModel } from '../models/follow-users.model';

export interface UserRepositoryInterface {
    existsByOptions(options: FindConditions<UserEntity>): Promise<boolean>;
    existsById(id: string | number): Promise<boolean>
    getFollowUser(id: string | number): Promise<FollowUsersModel[] | []>
}
