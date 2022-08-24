import { ProfileEntity } from './profile.entity';
import { EntityRepository } from 'typeorm';
import { BaseRepository, ProfileRepositoryInterface } from '@app/nest-postgre/entities';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(ProfileEntity)
export class ProfileRepository extends BaseRepository<ProfileEntity> implements ProfileRepositoryInterface {
    async getProfileByUserId(id: string) {
        const profile = await this.findOne({
            where: {
                owner: {
                    id: id,
                },
            },
            relations: ['owner', 'avatar', 'mainImage'],
        });
        if (!profile) {
            throw new BadRequestException('Профиль отсутствует');
        }
        return profile;
    }


}
