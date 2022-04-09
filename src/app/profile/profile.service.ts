import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProfileRequestDto } from './dto/update-profile/update-profile-request.dto';
import { UserEntity } from '../users/user.entity';
import { UsersRepository } from '../users/users.repository';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileResponseDto } from './dto/update-profile/update-profile-response.dto';
import { FindProfileResponseDto } from './dto/find-profile/find-profile-response.dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async updateProfile(user: UserEntity, dto: UpdateProfileRequestDto): Promise<UpdateProfileResponseDto> {
        const owner = await this.usersRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException('Профиль отсутствует');
        }
        const profile = await this.profileRepository.update(
            { owner },
            { ...dto },
        );
        return { updated: profile.affected === 1 };
    }

    async findProfile(userId: string): Promise<FindProfileResponseDto> {
        const owner = await this.usersRepository.findOne(userId);
        const profile = await this.profileRepository.findOne({ owner });
        if (!profile) {
            throw new BadRequestException('Профиль отсутствует');
        }
        return profile;
    }
}
