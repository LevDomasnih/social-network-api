import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsDateString, IsString } from 'class-validator';

export class BaseCustomEntity extends PartialType(BaseEntity)  {
    @ApiProperty({ type: String })
    @IsString()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ type: Date })
    @IsDateString()
    @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
    createdAt: Date;

    @ApiProperty({ type: Date })
    @IsDateString()
    @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
    updatedAt: Date;
}
