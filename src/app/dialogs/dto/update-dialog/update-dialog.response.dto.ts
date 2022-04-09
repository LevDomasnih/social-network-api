import { MessagesEntity } from '../../../messages/messages.entity';
import { UserEntity } from '../../../users/user.entity';

export class UpdateDialogResponseDto {
    newMessage: MessagesEntity;
    owners: UserEntity[];
}
