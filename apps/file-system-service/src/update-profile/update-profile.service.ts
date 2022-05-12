import { Injectable, Logger } from '@nestjs/common';
import { BaseFileWorkerService } from '../base-file-worker/base-file-worker.service';
import { ISaveFileResponse } from '../base-file-worker/base-file-worker.interface';
import { UpdateProfileRequestDto } from './dto/update-profile.request.dto';

@Injectable()
export class UpdateProfileService {
    private readonly logger = new Logger(UpdateProfileService.name);

    constructor(
        private readonly baseFileWorkerService: BaseFileWorkerService,
    ) {
    }

    async updateFile(args: UpdateProfileRequestDto): Promise<ISaveFileResponse> {
        return this.baseFileWorkerService.saveFile(args);
    }
}
