import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesRepository } from '@app/nest-postgre';
import { StaticService } from './static.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([FilesRepository]),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../../../../../../../../../', 'social-network-files', 'PUBLIC'),
            serveRoot: '/PUBLIC',
        }),
    ],
    providers: [StaticService],
    controllers: [StaticController],
})
export class StaticModule {
}