import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProfileModel } from './profile.model';

@Module({
  controllers: [ProfileController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: ProfileModel,
        schemaOptions: {
          collection: 'Profile'
        }
      }
    ])
  ],
  exports: [ProfileService],
  providers: [ProfileService]
})
export class ProfileModule {}
