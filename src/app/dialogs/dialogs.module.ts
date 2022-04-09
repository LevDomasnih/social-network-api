import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { DialogsGateway } from './dialogs.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesEntity } from '../messages/messages.entity';
import { DialogsRepository } from './dialogs.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
    controllers: [DialogsController],
    imports: [
        TypeOrmModule.forFeature([DialogsRepository, UsersRepository, MessagesEntity]),
        AuthModule,
        MessagesModule,
    ],
    providers: [DialogsService, DialogsGateway],
})
export class DialogsModule {
}
