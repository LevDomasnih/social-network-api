import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { FindConditions } from 'typeorm/find-options/FindConditions';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
    async existsByOptions(options: FindConditions<UserEntity>): Promise<boolean> {
        const search = await this.findOne(options)
        return search !== undefined
    }

    async existsById(id: string | number): Promise<boolean> {
        const search = await this.findOne(id)
        return search !== undefined
    }
}
