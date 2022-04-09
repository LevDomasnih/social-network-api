import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileRepository } from './profile.repository';
import { UsersRepository } from '../users/users.repository';

@Module({
    controllers: [ProfileController],
    imports: [
        TypeOrmModule.forFeature([ProfileRepository, UsersRepository]),
        AuthModule,
    ],
    exports: [ProfileService],
    providers: [ProfileService],
})
export class ProfileModule {
}
