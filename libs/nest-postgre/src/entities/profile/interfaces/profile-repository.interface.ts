import { ProfileEntity } from '@app/nest-postgre/entities';

export interface ProfileRepositoryInterface {
    getProfileByUserId(id: string): Promise<ProfileEntity>
}
