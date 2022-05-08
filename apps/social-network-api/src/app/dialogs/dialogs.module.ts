import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { DialogsGateway } from './dialogs.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DialogsRepository, MessagesRepository, UsersRepository } from '@app/nest-postgre';

@Module({
    controllers: [DialogsController],
    imports: [
        TypeOrmModule.forFeature([DialogsRepository, UsersRepository, MessagesRepository]),
        AuthModule,
        MessagesModule,
    ],
    providers: [DialogsService, DialogsGateway],
})
export class DialogsModule {
}
