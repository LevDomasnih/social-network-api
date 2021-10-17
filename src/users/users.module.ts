import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { ProfileModule } from '../profile/profile.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { FollowModule } from '../follow/follow.module';

@Module({
    controllers: [UsersController],
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User'
                }
            }
        ]),
        FollowModule,
        forwardRef(() => AuthModule),
        ProfileModule
    ],
    exports: [UsersService],
    providers: [UsersService]
})
export class UsersModule {
}
