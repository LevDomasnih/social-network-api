import { MessagesEntity, UserEntity } from '@app/nest-postgre';

export class UpdateDialogResponseDto {
    newMessage: MessagesEntity;
    owners: UserEntity[];
}
