import { Injectable } from '@nestjs/common';

@Injectable()
export class FileSystemServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
