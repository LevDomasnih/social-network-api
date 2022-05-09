import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesRepository, ProfileRepository, UsersRepository } from '@app/nest-postgre';

@Module({
    controllers: [ProfileController],
    imports: [
        TypeOrmModule.forFeature([ProfileRepository, UsersRepository, FilesRepository]),
        AuthModule,
    ],
    exports: [ProfileService],
    providers: [ProfileService],
})
export class ProfileModule {
}