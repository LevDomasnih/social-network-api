import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FilesRepository, ProfileRepository, UserEntity, UsersRepository } from '@app/nest-postgre';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UpdateProfileFileContract } from '@app/amqp-contracts';
import { IFileUpload } from '@app/common/model/file-upload.interface';
import { EditProfileInterfaceDto } from './interfaces/edit-profile.interface';
import { ProfileServiceInterface } from './interfaces/profile.service.interface';

@Injectable()
export class ProfileService implements ProfileServiceInterface {
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
        { email, login, ...dto }: EditProfileInterfaceDto,
    ) {
        const owner = await this.usersRepository.findOne(user.id);
        if (!owner) {
            throw new BadRequestException('Профиль отсутствует');
        }
        await this.usersRepository.update(
            user.id,
            { email, login },
        );
        await this.profileRepository.update(
            { owner },
            { ...dto },
        );
        return this.usersRepository.findOne(owner.id)
    }

    async editImage(
        file: IFileUpload,
        user: UserEntity,
        field: 'avatar' | 'mainImage',
    ) {
        const profile = await this.profileRepository.findOne({ owner: user }, { relations: [field] });

        if (!profile) {
            throw new BadRequestException('Профиля не существует');
        }

        const newFile = await this.amqpConnection.request<UpdateProfileFileContract.ResponsePayload>({
            exchange: UpdateProfileFileContract.queue.exchange,
            routingKey: UpdateProfileFileContract.queue.routingKey,
            payload: {
                buffer: file.buffer,
                user: user,
                fileField: field,
                oldPath: profile?.[field]?.path,
            },
        });

        let fileId;

        if (!profile[field]) {
            const image = await this.filesRepository.save({
                owner: user,
                ...newFile,
            });
            await this.profileRepository.update({ id: profile.id }, { [field]: image });
            fileId = image.id;
        } else {
            await this.filesRepository.update({ id: profile[field].id }, {
                ...newFile,
            });
            fileId = profile[field].id
        }

        return this.filesRepository.findOne(fileId)
    }
}
