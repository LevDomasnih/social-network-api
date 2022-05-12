import { BadRequestException, Injectable, StreamableFile } from '@nestjs/common';
import { FilesRepository, UserEntity } from '@app/nest-postgre';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class StaticService {

    constructor(
        private readonly filesRepository: FilesRepository,
    ) {
    }

    // TODO сделать предоставляемые файлы для других юзеров для PRIVATE
    async accessCheckAndGetFile(user: UserEntity, fileName: string) {
        const file = await this.filesRepository.findOne({ where: { owner: user, name: fileName } });
        if (!file) {
            return new BadRequestException('Файла не существует или доступ к нему ограничен');
        }
        const fileStream = createReadStream(join(file.path));
        return new StreamableFile(fileStream);
    }
}