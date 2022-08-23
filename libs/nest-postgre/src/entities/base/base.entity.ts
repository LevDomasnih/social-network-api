import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseCustomEntity extends PartialType(BaseEntity) {
    @Field(type => ID)
    @IsString()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(type => Date)
    @IsDateString()
    @CreateDateColumn({ type: 'timestamp', name: 'create_at' })
    createdAt: Date;

    @Field(type => Date)
    @IsDateString()
    @UpdateDateColumn({ type: 'timestamp', name: 'update_at' })
    updatedAt: Date;
}
