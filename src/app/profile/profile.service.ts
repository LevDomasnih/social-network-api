import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileRequestDto } from './dto/update-profile-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(ProfileEntity) private readonly profileRepository: Repository<ProfileEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) {
    }

    async updateProfile(user: UserEntity, dto: UpdateProfileRequestDto) {
        const owner = await this.userRepository.findOne(user.id);

        if (!owner) {
            throw new BadRequestException('Профиль отсутствует');
        }

        const profile = await this.profileRepository.update(
            { owner },
            { ...dto },
        );

        return profile.affected === 1;
    }

    async findProfile(userId: string) {
        const owner = await this.userRepository.findOne(userId);
        const profile = await this.profileRepository.findOne({ owner });

        if (!profile) {
            throw new BadRequestException('Профиль отсутствует');
        }

        return profile;
    }
}
