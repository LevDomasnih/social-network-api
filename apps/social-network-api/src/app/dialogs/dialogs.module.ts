import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { MessagesModule } from '../messages/messages.module';
import { DialogsGateway } from './dialogs.gateway';

@Module({
    controllers: [DialogsController],
    imports: [
        MessagesModule,
    ],
    providers: [DialogsService, DialogsGateway],
})
export class DialogsModule {
}
