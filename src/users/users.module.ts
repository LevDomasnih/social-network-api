import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { FollowModel } from '../follow/follow.model';

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
                typegooseClass: FollowModel,
                schemaOptions: {
                    collection: 'Follow'
                }
            }
        ]),
    ],
    exports: [UsersService],
    providers: [UsersService]
})
export class UsersModule {
}
