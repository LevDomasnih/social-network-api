import { Module } from '@nestjs/common';
import { DialogsService } from './dialogs.service';
import { MessagesModule } from '../messages/messages.module';
import { DialogsGateway } from './dialogs.gateway';
import { DialogsResolver } from './dialogs.resolver';

@Module({
    imports: [
        MessagesModule,
    ],
    providers: [DialogsService, DialogsGateway, DialogsResolver],
})
export class DialogsModule {
}
