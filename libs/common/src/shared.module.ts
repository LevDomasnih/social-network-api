import { Global, Module } from '@nestjs/common';
import { AmqpConnection, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { amqpConfig } from '@app/common/configs';
import { ConfigModule } from '@nestjs/config';
import { AMQP_CONNECTION_SERVICE_FACTORY } from '@app/common/configs/amqp.factory';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [
                amqpConfig,
            ],
        }),
        RabbitMQModule,
    ],
    providers: [
        AMQP_CONNECTION_SERVICE_FACTORY('amqp'),
    ],
    exports: [
        AmqpConnection
    ],
})
export class SharedModule {
}
