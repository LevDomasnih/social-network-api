import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { ProfileEntity, ProfileRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { EditAvatarResponse, EditProfileResponseDto, FindProfileResponseDto, UpdateProfileRequestDto } from './dto';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);
    private readonly url = process.env.API_URL || 'http://localhost:3000';
    private readonly dirPath = process.env.FILE_DIR || '../social-network-files';

    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly usersRepository: UsersRepository,
    ) {
    }

    async editProfile(
        user: UserEntity,
        { email, login, ...dto }: UpdateProfileRequestDto,
    ): Promise<EditProfileResponseDto> {
        const owner = await this.usersRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException('Профиль отсутствует');
        }
        const updatedUser = await this.usersRepository.update(
            user.id,
            { email, login },
        );
        const profile = await this.profileRepository.update(
            { owner },
            { ...dto },
        );
        return { updated: profile.affected === 1 && updatedUser.affected === 1 };
    }

    async findProfile(userId: string): Promise<FindProfileResponseDto> {
        const owner = await this.usersRepository.findOne(userId);
        const profile = await this.profileRepository.findOne({ owner });
        if (!profile) {
            throw new BadRequestException('Профиль отсутствует');
        }
        return {
            ...profile,
            avatar: this.url + '/files/' + profile.avatar,
            mainImage: this.url + '/files/' + profile.mainImage,
        } as ProfileEntity;
    }

    // TODO обдумать
    async editAvatar(file: Express.Multer.File[], user: UserEntity): Promise<EditAvatarResponse> {
        const { fileName, filePath, profile } = await this.updateFile(user, 'avatar');

        try {
            fs.writeFileSync(filePath, file[0].buffer);
            if (profile.avatar && existsSync(path.resolve(this.dirPath, profile.avatar))) {
                fs.unlinkSync(path.resolve(this.dirPath, profile.avatar));
            }
            await this.profileRepository.update({ id: profile.id }, { avatar: fileName });
        } catch (e) {
            this.logger.error(e);
            throw new BadRequestException(e);
        }

        return {
            fileName: this.url + '/files/' + fileName,
        };
    }

    async editMainImage(file: Express.Multer.File[], user: UserEntity) {
        const { fileName, filePath, profile } = await this.updateFile(user, 'mainImage');

        try {
            fs.writeFileSync(filePath, file[0].buffer);
            if (profile.mainImage && existsSync(path.resolve(this.dirPath, profile.mainImage))) {
                fs.unlinkSync(path.resolve(this.dirPath, profile.mainImage));
            }
            await this.profileRepository.update({ id: profile.id }, { mainImage: fileName });
        } catch (e) {
            this.logger.error(e);
            throw new BadRequestException(e);
        }

        return {
            fileName: this.url + '/files/' + fileName,
        };
    }

    private async updateFile(user: UserEntity, fileMethod: string) {
        const profile = await this.profileRepository.findOne({ owner: user });

        if (!profile) {
            throw new BadRequestException('Профиля не существует');
        }

        if (!existsSync(this.dirPath)) {
            mkdirSync(this.dirPath, { recursive: true });
        }

        const timestamp = Math.floor(new Date().getTime() / 1000).toString();
        const fileName = user.id + `_${fileMethod}_` + timestamp;
        const filePath = path.resolve(this.dirPath, fileName);

        return {
            fileName,
            filePath,
            profile,
        };
    }
}
