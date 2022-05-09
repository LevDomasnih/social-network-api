import { EntityRepository } from 'typeorm';
import { UserEntity } from './user.entity';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { BaseRepository, FollowUsersModel, UserRepositoryInterface } from '@app/nest-postgre/entities';

@EntityRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity> implements UserRepositoryInterface {
    async existsByOptions(options: FindConditions<UserEntity>): Promise<boolean> {
        const search = await this.findOne(options);
        return search !== undefined;
    }

    async existsById(id: string | number): Promise<boolean> {
        const search = await this.findOne(id);
        return search !== undefined;
    }

    async getFollowUser(id: string | number): Promise<FollowUsersModel[] | []> {
        return this.db.query(`
            SELECT u.id, u.email, u.login
            FROM follow f
                     INNER JOIN subscribers s ON f.id = s."subscriber_id"
                     INNER JOIN users u ON u.id = f."ownerId"
            WHERE f.id = $1
        `, [id]);
    }
}
