import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { DialogsModel } from './dialogs.model';
import { AuthModule } from '../auth/auth.module';
import { MessagesModule } from '../messages/messages.module';
import { UserModel } from '../users/user.model';
import { DialogsGateway } from './dialogs.gateway';

@Module({
    controllers: [DialogsController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: DialogsModel,
                schemaOptions: {
                    collection: 'Dialogs',
                },
            },
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User',
                },
            },
        ]),
        AuthModule,
        MessagesModule
    ],
    providers: [DialogsService, DialogsGateway],
})
export class DialogsModule {
}
