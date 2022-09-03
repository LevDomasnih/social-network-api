import { FilesEntity, ProfileEntity, UserEntity } from '@app/nest-postgre';
import { IFileUpload } from '@app/common/model/file-upload.interface';
import { EditProfileInterfaceDto, EditProfileInterfaceReturn } from './edit-profile.interface';
import { FindProfileInterface } from './find-profile.interface';
import { EditImageInterface } from './edit-image.interface';

export interface ProfileServiceInterface {
    editProfile(user: UserEntity, data: EditProfileInterfaceDto): Promise<UserEntity | undefined>
    editImage(
        file: IFileUpload,
        user: UserEntity,
        field: 'avatar' | 'mainImage'
    ): Promise<FilesEntity | undefined>
}
