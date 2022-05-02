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
        synchronize: false,
        migrationsRun: true,
        logging: true,
        migrations: ['dist/common/migrations/**/*{.ts,.js}'],
        cli: {
            migrationsDir: 'src/common/migrations',
        },
    };
};

export default {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: true,
    migrations: ['dist/common/migrations/**/*{.ts,.js}'],
    cli: {
        migrationsDir: 'src/common/migrations',
    },
};
