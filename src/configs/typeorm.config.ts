import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {

    return {
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        // @ts-ignore
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
    }
};
