import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';
import { UserEntity } from '../users/user.entity';

@Module({
    controllers: [ProfileController],
    imports: [
        TypeOrmModule.forFeature([ProfileEntity, UserEntity]),
        AuthModule,
    ],
    exports: [ProfileService],
    providers: [ProfileService],
})
export class ProfileModule {
}
