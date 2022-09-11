import { FindConditions } from 'typeorm/find-options/FindConditions';
import { UserEntity } from '../user.entity';
import { FollowUsersModel } from '@app/nest-postgre/entities';

export interface UserRepositoryInterface {
    existsByOptions(options: FindConditions<UserEntity>): Promise<boolean>,
    existsById(id: string | number): Promise<boolean>,
    getFollowUser(id: string | number): Promise<FollowUsersModel[] | []>,
    getUserById(id: string): Promise<UserEntity>,
    getUsers(): Promise<UserEntity[]>,
}
