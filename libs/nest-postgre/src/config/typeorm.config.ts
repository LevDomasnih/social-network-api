import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeOrm = {
    entities: ['dist/apps/social-network-api/libs/nest-postgre/src/entities/**/*.entity{.ts,.js}'],
    synchronize: true,
    migrationsRun: false,
    logging: false,
    migrations: ['dist/apps/social-network-api/apps/social-network-api/src/migrations/*{.ts,.js}'],
    cli: {
        migrationsDir: 'apps/social-network-api/src/migrations',
    },
}

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
        ...typeOrm
    };
};

export default {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ...typeOrm
};
