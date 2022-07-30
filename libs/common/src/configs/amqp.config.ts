import { registerAs } from '@nestjs/config';
import { RabbitMQConfig, RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { FILE_SYSTEM_EXCHANGE } from '@app/amqp-contracts';

export const AMQP_CONFIG_EXCHANGES: RabbitMQExchangeConfig[] = [
    FILE_SYSTEM_EXCHANGE
];

export const amqpConfig = registerAs('amqp', (): RabbitMQConfig => ({
    uri: [
        process.env.AMQP_URI,
    ].filter(amqpUrl => !!amqpUrl) as string[],
    exchanges: AMQP_CONFIG_EXCHANGES,
    connectionInitOptions: { wait: true, timeout: 10000 },
    connectionManagerOptions: {
        heartbeatIntervalInSeconds: 15,
        reconnectTimeInSeconds: 30,
    },
}))
