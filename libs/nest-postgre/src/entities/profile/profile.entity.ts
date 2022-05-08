import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../users/user.entity';

@Entity('profiles')
export class ProfileEntity extends BaseEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: () => UserEntity, default: 'ownerId' })
    @OneToOne(() => UserEntity, user => user.profile)
    @JoinColumn()
    owner: UserEntity

    @ApiProperty()
    @Column({name: 'first_name'})
    firstName: string

    @ApiProperty()
    @Column({name: 'last_name'})
    lastName: string

    @ApiProperty()
    @Column({name: 'middle_name', nullable: true})
    middleName: string

    @ApiProperty()
    @Column()
    phone: string

    @ApiProperty()
    @Column({ nullable: true })
    avatar?: string

    @ApiProperty()
    @Column({ nullable: true })
    status?: string;

    @ApiProperty()
    @Column({ nullable: true })
    about?: string;

    @ApiProperty()
    @Column({ type: 'timestamp', nullable: true })
    birthday?: string;

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

    @ApiProperty()
    @Column({ name: 'main_image', nullable: true })
    mainImage?: string
}
