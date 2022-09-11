import { FilesEntity } from '@app/nest-postgre/entities';

export interface FilesRepositoryInterface {
    getFilePath(id: string): Promise<string | null>;

    getFile(id: string): Promise<FilesEntity | undefined>;
}
