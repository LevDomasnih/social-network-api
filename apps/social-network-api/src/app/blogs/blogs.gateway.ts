import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

// TODO Сокет для лайков и просмотров поста
@WebSocketGateway({ namespace: '/blogs' })
export class BlogsGateway implements OnGatewayInit, OnGatewayConnection {

    @WebSocketServer()
    server: Server;

    private logger = new Logger('BlogsGateway');

    private arr: string[] = [];

    afterInit(server: Server) {
        this.logger.log('Initialized!');

        this.server.emit('toClient', this.arr);
    }

    // tslint:disable-next-line:no-any
    handleConnection(client: any, ...args: any[]): any {
        this.server.emit('toClient', this.arr);
    }

    @SubscribeMessage('toServer')
    handleEvent(@MessageBody() message: string) {
        this.arr.push(message);
        this.server.emit('toClient', this.arr);
    }
}
