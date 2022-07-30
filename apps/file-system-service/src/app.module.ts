import { Module } from '@nestjs/common';
import { SharedModule } from '@app/common/shared.module';
import { UpdateProfileConsumerService } from './update-profile/update-profile.consumer.service';
import { UpdateProfileService } from './update-profile/update-profile.service';
import { BaseFileWorkerModule } from './base-file-worker/base-file-worker.module';

@Module({
    imports: [
        SharedModule,
        BaseFileWorkerModule,
    ],
    providers: [
        UpdateProfileConsumerService,
        UpdateProfileService,
    ],
})
export class AppModule {
}
