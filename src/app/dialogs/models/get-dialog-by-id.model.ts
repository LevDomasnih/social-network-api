import { MessagesEntity } from '../../messages/messages.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetDialogByIdModel {
    @ApiProperty({
        description: 'id диалога',
        example: 'b92b7fe8-130b-423b-92b8-ba5c2236dfd8'
    })
    id: string;
    @ApiProperty({
        description: 'id юзера',
        example: 'e8c4986b-1b5f-47c9-a533-d22329df0da7'
    })
    userId: string;
    @ApiProperty({
        description: 'id диалога',
        example: 'b92b7fe8-130b-423b-92b8-ba5c2236dfd8'
    })
    dialogsId: string;
    @ApiProperty({
        description: 'сообщения',
        type: [MessagesEntity]
    })
    messages: MessagesEntity[]
}
