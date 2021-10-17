import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';

@Module({
  controllers: [ProfileController],
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
  exports: [ProfileService],
  providers: [ProfileService]
})
export class ProfileModule {}
