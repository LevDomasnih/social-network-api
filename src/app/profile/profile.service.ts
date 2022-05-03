import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UpdateProfileRequestDto } from './dto/update-profile/update-profile.request.dto';
import { UserEntity } from '../users/user.entity';
import { UsersRepository } from '../users/users.repository';
import { ProfileRepository } from './profile.repository';
import { EditProfileResponseDto } from './dto/update-profile/edit-profile.response.dto';
import { FindProfileResponseDto } from './dto/find-profile/find-profile.response.dto';
import * as fs from 'fs';
import * as path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { EditAvatarResponse } from './dto/edit-avatar/edit-avatar.response';
import { ProfileEntity } from './profile.entity';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name)

    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async editProfile(
        user: UserEntity,
        { email, login, ...dto }: UpdateProfileRequestDto
    ): Promise<EditProfileResponseDto> {
        const owner = await this.usersRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException('Профиль отсутствует');
        }
        const updatedUser = await this.usersRepository.update(
            user.id,
            {email, login}
        );
        const profile = await this.profileRepository.update(
            { owner },
            { ...dto },
        );
        return { updated: profile.affected === 1 && updatedUser.affected === 1 };
    }

    async findProfile(userId: string): Promise<FindProfileResponseDto> {
        const url = process.env.API_URL || 'http://localhost:3000'
        const owner = await this.usersRepository.findOne(userId);
        const profile = await this.profileRepository.findOne({ owner });
        if (!profile) {
            throw new BadRequestException('Профиль отсутствует');
        }
        return {
            ...profile,
            avatar: url + '/files/' + profile.avatar,
            mainImage: url + '/files/' + profile.mainImage
        } as ProfileEntity;
    }

    async editAvatar(file: Express.Multer.File[], user: UserEntity): Promise<EditAvatarResponse> {
        const dirPath = process.env.FILE_DIR || '../social-network-files'
        const profile = await this.profileRepository.findOne({owner: user})

        if (!profile) {
            throw new BadRequestException('Профиля не существует')
        }

        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true });
        }

        const timestamp = Math.floor(new Date().getTime() / 1000).toString()
        const fileName = user.id + '_avatar_' + timestamp
        const filePath = path.resolve(dirPath, fileName)

        try {
            fs.writeFileSync(filePath, file[0].buffer)
            if (profile.avatar && existsSync(profile.avatar)) {
                fs.unlinkSync(profile.avatar)
            }
            await this.profileRepository.update({id: profile.id}, {avatar: fileName})
        } catch (e) {
            this.logger.error(e)
            throw new BadRequestException(e)
        }

        return {
            fileName
        };
    }
}
