import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DialogsService } from './dialogs.service';
import { JwtWsAuthGuard } from '../auth/guards/jwt-ws.guard';
import { User } from '@app/common';
import { UserEntity } from '@app/nest-postgre';
import { CreateDialogRequestDto, UpdateDialogRequestDto } from './dto';


@WebSocketGateway({
    namespace: '/dialogs',
    cors: {
        origin: 'http://localhost:3001',
        credentials: true,
        allowedHeaders: ['my-custom-header']
    }
})
export class DialogsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
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


    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('joinRoom')
    @UseGuards(JwtWsAuthGuard)
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @User() user: UserEntity
    ) {
        client.join(user.id);
    }

    @SubscribeMessage('createMessage')
    @UseGuards(JwtWsAuthGuard)
    async handleMessage(
        @User() user: UserEntity,
        @ConnectedSocket() client: Socket,
        @MessageBody() dto: CreateDialogRequestDto
    ) {
        try {
            const dialogs = await this.dialogsService.sendMessageInDialog(user, dto)
            this.wss.to([dto.secondOwnerId, user.id]).emit('getMessage', dialogs);
        } catch (e) {

        }
    }

    @SubscribeMessage('leftRoom')
    @UseGuards(JwtWsAuthGuard)
    handleLeftRoom(
        @ConnectedSocket() client: Socket,
        @User() user: UserEntity
    ) {
        client.leave(user.id);
    }

}
