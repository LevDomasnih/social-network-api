import { Module } from '@nestjs/common';
import { NestPostgreService } from './nest-postgre.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from '@app/nest-postgre/config/typeorm.config';

@Module({
  providers: [NestPostgreService],
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfig,
      inject: [ConfigService]
    }),
  ],
  exports: [NestPostgreService],
})
export class NestPostgreModule {}
