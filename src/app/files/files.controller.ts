import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express'

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {
    }

    // TODO можно связать таблицы, сюда закидывать имя, путь и еще какие-то данные про файл

    @Get(':fileName')
    getFile(@Param('fileName') fileName: string, @Res() res: Response) {
        return res.sendFile(fileName, { root: '../social-network-files'})
    }
}
