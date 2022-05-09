import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Status } from '@app/nest-postgre';
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

    async saveFile({ buffer, user, fileField, oldPath, folder }: ISaveFileRequest): Promise<ISaveFileResponse> {
        const { fileName, filePath } = this.makeDir({
            user: user, fileMethod: fileField, folder: folder || 'public',
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
            path: filePath,
            name: fileName,
            status: Status.SAVED,
            lastProlong: new Date(),
            mime: mime.lookup(filePath),
            size: fs.statSync(filePath).size,
        };
    }

    private makeDir({ user, fileMethod, folder }: IMakeDirRequest): IMakeDirResponse {
        const publicMid = path.resolve(this.dirPath, folder);

        if (!fs.existsSync(publicMid)) {
            fs.mkdirSync(publicMid, { recursive: true });
        }

        const timestamp = Math.floor(new Date().getTime() / 1000).toString();
        const fileName = user.id + `_${fileMethod.toUpperCase()}_` + timestamp;
        const filePath = path.resolve(publicMid, fileName);

        return {
            fileName,
            filePath,
        };
    }
}
