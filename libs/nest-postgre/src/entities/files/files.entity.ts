import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCustomEntity, UserEntity } from '@app/nest-postgre/entities';
import { ApiProperty } from '@nestjs/swagger';

export enum Status {
    SAVED = 'SAVED',
    PROLONG = 'PROLONG',
    REJECTED = 'REJECTED',
}

export enum FolderName {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}

const url = process.env.API_URL || 'http://localhost:3000'

@Entity('files')
export class FilesEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity, default: 'ownerId' })
    @ManyToOne(() => UserEntity, user => user.profile)
    @JoinColumn({ name: 'owner_id' })
    owner: UserEntity;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    path: string;

    @ApiProperty()
    @Column()
    size: number;

    @ApiProperty()
    @Column()
    mime: string;

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.SAVED
    })
    status: Status;

    @ApiProperty()
    @Column({ type: 'timestamp', name: 'last_prolong' })
    lastProlong: Date;

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: FolderName,
        default: FolderName.PUBLIC
    })
    folder: FolderName

    getFilePath(): string | null {
        if (!this.folder || !this.name) {
            return null
        }
        return url + '/' + this.folder + '/' + this.name
    }
}
