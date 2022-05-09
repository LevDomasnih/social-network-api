import { Injectable, Logger } from '@nestjs/common';
import { BaseFileWorkerService } from '../base-file-worker/base-file-worker.service';
import { ISaveFileRequest } from '../base-file-worker/base-file-worker.interface';

@Injectable()
export class UpdateProfileService {
    private readonly logger = new Logger(UpdateProfileService.name);

    constructor(
        private readonly baseFileWorkerService: BaseFileWorkerService,
    ) {
    }

    async updateFile(args: ISaveFileRequest) {
        return this.baseFileWorkerService.saveFile(args);
    }
}
