import { Module } from '@nestjs/common';
import { SharedModule } from '@app/common/shared.module';
import { UpdateProfileConsumerService } from './update-profile/update-profile.consumer.service';
import { UpdateProfileService } from './update-profile/update-profile.service';
import { NestPostgreModule } from '@app/nest-postgre';
import { BaseFileWorkerModule } from './base-file-worker/base-file-worker.module';

@Module({
    imports: [
        SharedModule,
        NestPostgreModule,
        BaseFileWorkerModule,
    ],
    providers: [
        UpdateProfileConsumerService,
        UpdateProfileService,
    ],
})
export class AppModule {
}
