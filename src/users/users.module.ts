import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ProfileModel } from '../profile/profile.model';

@Module({
    controllers: [UsersController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User'
                }
            },
            {
                typegooseClass: ProfileModel,
                schemaOptions: {
                    collection: 'Profile'
                }
            }
        ]),
    ],
    exports: [UsersService],
    providers: [UsersService]
})
export class UsersModule {
}
