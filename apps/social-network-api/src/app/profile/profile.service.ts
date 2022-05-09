import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FilesRepository, ProfileRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { EditAvatarResponse, EditProfileResponseDto, FindProfileResponseDto, UpdateProfileRequestDto } from './dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);
    private readonly url = process.env.API_URL || 'http://localhost:3000';

    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly usersRepository: UsersRepository,
        private readonly filesRepository: FilesRepository,
        private readonly amqpConnection: AmqpConnection,
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
        const profile = await this.profileRepository.findOne({ owner }, { relations: ['avatar', 'mainImage'] });
        if (!profile) {
            throw new BadRequestException('Профиль отсутствует');
        }
        return {
            ...profile,
            avatar: this.url + '/' + (profile.avatar?.name || ''),
            mainImage: this.url + '/' + (profile.mainImage?.name || ''),
        };
    }

    async editImage(
        file: Express.Multer.File[],
        user: UserEntity,
        field: 'avatar' | 'mainImage',
    ): Promise<EditAvatarResponse> {
        const profile = await this.profileRepository.findOne({ owner: user }, { relations: [field] });

        if (!profile) {
            throw new BadRequestException('Профиля не существует');
        }

        const newFile = await this.amqpConnection.request({
            exchange: 'file-system',
            routingKey: 'update-profile-file',
            payload: {
                buffer: file[0].buffer,
                user: user,
                fileField: field,
                oldPath: profile?.[field]?.path,
            },
        });

        if (!profile[field]) {
            const image = await this.filesRepository.save({
                owner: user,
                ...newFile,
            });
            await this.profileRepository.update({ id: profile.id }, { [field]: image });
        } else {
            await this.filesRepository.update({ id: profile[field].id }, {
                ...newFile,
            });
        }

        return {
            // @ts-ignore
            fileName: this.url + '/' + newFile.name,
        };
    }
}
