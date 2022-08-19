import { GetUserByIdInterfaceReturn } from './get-user-by-id.interface';
import { GetUsersInterfaceReturn } from './get-users.interface';
import { GetFollowInterfaceReturn } from './get-follow.interface';

export interface UsersServiceInterface {
    getUserById(id: string): Promise<GetUserByIdInterfaceReturn>
    getUsers(): Promise<GetUsersInterfaceReturn[]>
    getFollowUsers(id: string): Promise<GetFollowInterfaceReturn[] | []>
}
