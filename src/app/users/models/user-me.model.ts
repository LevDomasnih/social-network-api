import { ProfileEntity } from '../../profile/profile.entity';

export class UserMeModel {
    id: string;
    email: string
    login: string
    profile: ProfileEntity
}
