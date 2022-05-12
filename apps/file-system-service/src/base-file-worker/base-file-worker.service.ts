import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as mime from 'mime';
import * as fs from 'fs';
import * as path from 'path';
import {
    BaseFileWorkerInterface,
    IMakeDirRequest,
    IMakeDirResponse,
    ISaveFileRequest,
    ISaveFileResponse,
} from './base-file-worker.interface';

@Injectable()
export class BaseFileWorkerService implements BaseFileWorkerInterface {
    private readonly logger = new Logger(BaseFileWorkerService.name);
    private readonly dirPath = process.env.FILE_DIR || '../social-network-files';

    constructor() {
    }

    async saveFile(
        { buffer, user, fileField, oldPath, folder, status, lastProlong }: ISaveFileRequest
    ): Promise<ISaveFileResponse> {
        const { fileName, filePath } = this.makeDir({
            user: user, fileMethod: fileField, folder: folder,
        });

        try {
            fs.writeFileSync(filePath, Buffer.from(buffer));
            if (oldPath && fs.existsSync(oldPath)) {
                this.logger.verbose(`Start delete`)
                fs.unlinkSync(oldPath);
                this.logger.verbose(`Delete ${oldPath}`)
            }
        } catch (e) {
            this.logger.error(e);
            throw new BadRequestException(e);
        }

        return {
            folder: folder,
            path: filePath,
            name: fileName,
            status: status,
            lastProlong: lastProlong,
            mime: mime.lookup(filePath),
            size: fs.statSync(filePath).size,
        };
    }

    private makeDir({ user, fileMethod, folder }: IMakeDirRequest): IMakeDirResponse {
        const dir = path.resolve(this.dirPath, folder);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const timestamp = Math.floor(new Date().getTime() / 1000).toString();
        const fileName = user.id + `_${fileMethod.toUpperCase()}_` + timestamp;
        const filePath = path.resolve(dir, fileName);

        return {
            fileName,
            filePath,
        };
    }
}
