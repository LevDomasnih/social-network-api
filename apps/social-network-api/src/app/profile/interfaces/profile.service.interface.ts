import { ProfileEntity, UserEntity } from '@app/nest-postgre';
import { IFileUpload } from '@app/common/model/file-upload.interface';
import { EditProfileInterfaceDto, EditProfileInterfaceReturn } from './edit-profile.interface';
import { FindProfileInterface } from './find-profile.interface';
import { EditImageInterface } from './edit-image.interface';

export interface ProfileServiceInterface {
    editProfile(user: UserEntity, data: EditProfileInterfaceDto): Promise<EditProfileInterfaceReturn>
    editImage(
        files: IFileUpload[],
        user: UserEntity,
        field: 'avatar' | 'mainImage'
    ): Promise<EditImageInterface>
}
