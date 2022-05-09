import { registerAs } from '@nestjs/config';
import { RabbitMQConfig, RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';

export const AMQP_CONFIG_EXCHANGES: RabbitMQExchangeConfig[] = [
    {
        name: 'file-system',
        type: 'direct',
    },
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
