import { GetFollowInterfaceReturn } from './get-follow.interface';

export interface UsersServiceInterface {
    getFollowUsers(id: string): Promise<GetFollowInterfaceReturn[] | []>;
}
