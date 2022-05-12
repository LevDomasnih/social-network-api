import { Global, Module } from '@nestjs/common';
import { BaseFileWorkerService } from './base-file-worker.service';

@Global()
@Module({
    providers: [BaseFileWorkerService],
    exports: [BaseFileWorkerService]
})
export class BaseFileWorkerModule {}
