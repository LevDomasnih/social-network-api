import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { FollowModel } from './follow.model';

@Module({
  controllers: [FollowController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: FollowModel,
        schemaOptions: {
          collection: 'Follow'
        }
      }
    ]),
  ],
  exports: [FollowService],
  providers: [FollowService]
})
export class FollowModule {}
