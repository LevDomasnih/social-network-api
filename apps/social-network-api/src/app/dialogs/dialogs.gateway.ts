import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DialogsService } from './dialogs.service';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws.guard';
import { User } from '@app/common';
import { UserEntity } from '@app/nest-postgre';
import { UpdateDialogRequestDto } from './dto';


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
        @MessageBody() dto: UpdateDialogRequestDto,
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
