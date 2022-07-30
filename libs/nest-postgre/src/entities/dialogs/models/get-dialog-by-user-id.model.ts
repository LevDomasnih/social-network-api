import { ApiProperty } from '@nestjs/swagger';
import { MessagesEntity } from '@app/nest-postgre/entities';

export class GetDialogByUserIdModel {
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
        description: 'последние сообщение',
        type: [MessagesEntity]
    })
    lastMessage: MessagesEntity[]
}
