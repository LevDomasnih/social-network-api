import { AmqpConnection, RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const AMQP_CONNECTION_SERVICE_FACTORY = (configIdent: string) => ({
    provide: AmqpConnection,
    useFactory: async (configService: ConfigService) => {
        const amqpConfig: RabbitMQConfig | undefined = configService.get(configIdent);

        if (amqpConfig) {
            const amqpConnection = new AmqpConnection(amqpConfig);
            Logger.verbose('AMQP Init...', 'Amqp_Connection');
            // Logger.debug({ amqpConfig });
            await amqpConnection.init().catch((error) => {
                Logger.error('connection fail', error, 'RABBIT MQ Connection factory');
            });

            Logger.verbose('AMQP Init done.', 'Amqp_Connection');
            return amqpConnection;
        }
    },
    inject: [ ConfigService ],
});
