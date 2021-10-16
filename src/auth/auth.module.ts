import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';

@Module({
  controllers: [AuthController],
  imports: [
      TypegooseModule.forFeature([
        {
          typegooseClass: UserModel,
          schemaOptions: {
            collection: 'User',
          },
        }
      ])
  ],
  providers: [AuthService]
})
export class AuthModule {}
