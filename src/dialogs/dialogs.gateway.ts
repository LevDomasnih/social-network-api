import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DialogsService } from './dialogs.service';
import { User } from '../decorators/user.decorator';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws.guard';
import { UpdateDialogResponseDto } from './dto/update-dialog-response.dto';
import { UserEntity } from '../users/user.entity';


@WebSocketGateway({ namespace: '/dialogs' })
export class DialogsGateway implements OnGatewayInit {
    constructor(
        private readonly dialogsService: DialogsService,
    ) {
    }

    @WebSocketServer()
    wss: Server;

    private logger = new Logger('DialogsGateway');

    afterInit() {
        this.logger.log('Initialized!');
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, userId: string) {
        client.join(userId);
    }

    @SubscribeMessage('createMessage')
    @UseGuards(JwtWsAuthGuard)
    async handleMessage(
        @User() user: UserEntity,
        @MessageBody() dto: UpdateDialogResponseDto,
    ) {
        try {
            const {
                newMessage,
                owners,
            } = await this.dialogsService.updateDialog(user, dto);

            this.wss.to(owners.map(o => o.id)).emit('getMessage', newMessage);
        } catch (e) {

        }
    }

    @SubscribeMessage('leftRoom')
    handleLeftRoom(client: Socket, userId: string) {
        client.leave(userId);
    }
}
