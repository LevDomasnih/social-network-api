import { Controller, Get } from '@nestjs/common';
import { FileSystemServiceService } from './file-system-service.service';

@Controller()
export class FileSystemServiceController {
  constructor(private readonly fileSystemServiceService: FileSystemServiceService) {}

  @Get()
  getHello(): string {
    return this.fileSystemServiceService.getHello();
  }
}
