import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { DialogsModel } from './dialogs.model';
import { AuthService } from '../auth/auth.service';

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
        ]),
        AuthService,
    ],
    providers: [DialogsService],
})
export class DialogsModule {
}
