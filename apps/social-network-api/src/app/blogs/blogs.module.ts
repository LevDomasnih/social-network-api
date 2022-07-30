import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { BlogsGateway } from './blogs.gateway';

@Module({
    controllers: [BlogsController],
    imports: [],
    providers: [BlogsService, BlogsGateway],
})
export class BlogsModule {
}
