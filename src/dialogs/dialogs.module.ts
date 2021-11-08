import { Module } from '@nestjs/common';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { DialogsModel } from './dialogs.model';
import { AuthModule } from '../auth/auth.module';

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
        AuthModule,
    ],
    providers: [DialogsService],
})
export class DialogsModule {
}
