import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsGateway } from './blogs.gateway';
import { BlogsResolver } from './blogs.resolver';

@Module({
    imports: [],
    providers: [BlogsService, BlogsGateway, BlogsResolver],
})
export class BlogsModule {
}
