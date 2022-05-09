import { Module } from '@nestjs/common';
import { BaseFileWorkerService } from './base-file-worker.service';

@Module({
    providers: [BaseFileWorkerService],
    exports: [BaseFileWorkerService]
})
export class BaseFileWorkerModule {}
