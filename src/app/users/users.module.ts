import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';

@Module({
    controllers: [UsersController],
    imports: [
        TypeOrmModule.forFeature([UsersRepository]),
        AuthModule,
    ],
    exports: [UsersService],
    providers: [UsersService],
})
export class UsersModule {
}
