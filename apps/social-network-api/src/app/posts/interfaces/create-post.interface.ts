import { PostEntity, UserEntity } from '@app/nest-postgre';

export class CreatePostInterfaceDto {
    text: string;
    parentPost: string;
}

export class CreatePostInterfaceReturn extends PostEntity {
    owner: UserEntity;
    text: string;
    parentPosts: PostEntity | null | undefined
}
