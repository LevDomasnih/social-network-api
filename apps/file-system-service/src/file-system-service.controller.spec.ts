import { Test, TestingModule } from '@nestjs/testing';
import { FileSystemServiceController } from './file-system-service.controller';
import { FileSystemServiceService } from './file-system-service.service';

describe('FileSystemServiceController', () => {
  let fileSystemServiceController: FileSystemServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileSystemServiceController],
      providers: [FileSystemServiceService],
    }).compile();

    fileSystemServiceController = app.get<FileSystemServiceController>(FileSystemServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fileSystemServiceController.getHello()).toBe('Hello World!');
    });
  });
});
