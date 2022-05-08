import { Module } from '@nestjs/common';
import { FileSystemServiceController } from './file-system-service.controller';
import { FileSystemServiceService } from './file-system-service.service';

@Module({
  imports: [],
  controllers: [FileSystemServiceController],
  providers: [FileSystemServiceService],
})
export class FileSystemServiceModule {}
