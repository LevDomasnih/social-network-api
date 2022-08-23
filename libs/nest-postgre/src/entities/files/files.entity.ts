import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseCustomEntity, UserEntity } from '@app/nest-postgre/entities';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum Status {
    SAVED = 'SAVED',
    PROLONG = 'PROLONG',
    REJECTED = 'REJECTED',
}

export enum FolderName {
    PUBLIC = 'PUBLIC',
    PRIVATE = 'PRIVATE',
}
registerEnumType(Status, { name: 'Status' })
registerEnumType(FolderName, { name: 'FolderName' })

const url = process.env.API_URL || 'http://localhost:3000'

@ObjectType()
@Entity('files')
export class FilesEntity extends BaseCustomEntity {
    @Field(type => UserEntity)
    @ManyToOne(() => UserEntity, user => user.profile)
    @JoinColumn({ name: 'owner_id' })
    owner: UserEntity;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    path: string;

    @Field()
    @Column()
    size: number;

    @Field()
    @Column()
    mime: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.SAVED
    })
    @Field(type => Status)
    status: Status;

    @Field(type => Date)
    @Column({ type: 'timestamp', name: 'last_prolong' })
    lastProlong: Date;

    @Field(type => FolderName)
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
