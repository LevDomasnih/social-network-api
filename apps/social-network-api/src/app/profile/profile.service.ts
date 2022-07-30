import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FilesRepository, ProfileRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { EditAvatarResponse, EditProfileResponseDto, FindProfileResponseDto, UpdateProfileRequestDto } from './dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UpdateProfileFileContract } from '@app/amqp-contracts';

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
            avatar: profile?.avatar?.folder ?
                this.url + '/' + profile.avatar.folder + '/' + (profile.avatar?.name || '') : null,
            mainImage: profile?.mainImage?.folder ?
                this.url + '/' + profile.mainImage.folder + '/' + (profile.mainImage?.name || '') : null,
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

        const newFile = await this.amqpConnection.request<UpdateProfileFileContract.ResponsePayload>({
            exchange: UpdateProfileFileContract.queue.exchange,
            routingKey: UpdateProfileFileContract.queue.routingKey,
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
            fileName: this.url + '/' + newFile.folder + '/' + newFile.name,
        };
    }
}
