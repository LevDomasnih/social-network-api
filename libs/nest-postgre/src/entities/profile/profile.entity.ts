import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';
import { BaseCustomEntity, FilesEntity } from '@app/nest-postgre/entities';

@Entity('profiles')
export class ProfileEntity extends BaseCustomEntity {
    @ApiProperty({ type: () => UserEntity, default: 'ownerId' })
    @OneToOne(() => UserEntity, user => user.profile)
    @JoinColumn({name: 'owner_id'})
    owner: UserEntity;

    @ApiProperty()
    @Column({ name: 'first_name' })
    firstName: string;

    @ApiProperty()
    @Column({ name: 'last_name' })
    lastName: string;

    @ApiProperty()
    @Column({ name: 'middle_name', nullable: true })
    middleName: string;

    @ApiProperty()
    @Column()
    phone: string;

    @ApiProperty({type: () => FilesEntity})
    @OneToOne(() => FilesEntity)
    @JoinColumn({ name: 'avatar_id' })
    avatar: FilesEntity;

    @ApiProperty({type: () => FilesEntity})
    @OneToOne(() => FilesEntity)
    @JoinColumn({ name: 'main_image_id' })
    mainImage: FilesEntity;

    @ApiProperty()
    @Column({ nullable: true })
    status?: string;

    @ApiProperty()
    @Column({ nullable: true })
    about?: string;

    @ApiProperty()
    @Column({ type: 'timestamp', nullable: true, default: new Date(0) })
    birthday?: Date;

    @ApiProperty()
    @Column({ nullable: true })
    country?: string;

    @ApiProperty()
    @Column({ nullable: true })
    city?: string;

    @ApiProperty()
    @Column({ nullable: true })
    relatives?: string;

    @ApiProperty()
    @Column({ nullable: true })
    school?: string;
}
