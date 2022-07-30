import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UpdateProfileConsumerService } from './update-profile.consumer.service';
import { UpdateProfileService } from './update-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesRepository, ProfileRepository, UsersRepository } from '@app/nest-postgre';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProfileRepository, UsersRepository, FilesRepository]),
        RabbitMQModule,
    ],
    providers: [
        UpdateProfileService,
        UpdateProfileConsumerService,
    ]
})
export class UpdateProfileModule {
}
