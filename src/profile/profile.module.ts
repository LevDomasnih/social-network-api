import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from '../users/user.model';
import { ProfileModel } from './profile.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ProfileController],
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
    AuthModule,
  ],
  exports: [ProfileService],
  providers: [ProfileService]
})
export class ProfileModule {}
