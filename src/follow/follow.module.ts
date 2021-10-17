import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';

@Module({
  controllers: [FollowController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User'
        }
      }
    ]),
  ],
  exports: [FollowService],
  providers: [FollowService]
})
export class FollowModule {}
