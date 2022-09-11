import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
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
import { CreateDialogInterfaceArgs } from './interfaces/create-dialog.interface';


@WebSocketGateway({
    namespace: '/dialogs',
    cors: {
        origin: 'http://localhost:3001',
        credentials: true,
        allowedHeaders: ['my-custom-header'],
    },
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
        @User() user: UserEntity,
    ) {
        client.join(user.id);
    }

    @SubscribeMessage('sendMessage')
    @UseGuards(JwtWsAuthGuard)
    async handleMessage(
        @User() user: UserEntity,
        @ConnectedSocket() client: Socket,
        @MessageBody() { secondOwnerId, ...messageData }: CreateDialogInterfaceArgs,
    ) {
        // try {
        //     const dialogId = await this.dialogsService.findDialogId(user.id, secondOwnerId);
        //     if (dialogId) {
        //         const message = await this.dialogsService.updateDialog(user, { dialogId, ...messageData });
        //         this.wss.to([...new Set([secondOwnerId, user.id])]).emit('getMessage', message);
        //     } else {
        //         const newUsersDialog = await this.dialogsService.createDialog(user, { secondOwnerId, ...messageData });
        //         for (const userDialog of newUsersDialog) {
        //             this.wss.to([userDialog.to]).emit('getNewDialog', userDialog.dialog);
        //         }
        //     }
        // } catch (e) {
        //
        // }
    }

    @SubscribeMessage('leftRoom')
    @UseGuards(JwtWsAuthGuard)
    handleLeftRoom(
        @ConnectedSocket() client: Socket,
        @User() user: UserEntity,
    ) {
        client.leave(user.id);
    }

}
