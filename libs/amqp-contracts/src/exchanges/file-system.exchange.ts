import { RabbitMQExchangeConfig } from '@golevelup/nestjs-rabbitmq';
import { ExchangeType } from '@app/amqp-contracts/common';

export const FILE_SYSTEM_EXCHANGE: RabbitMQExchangeConfig = {
    name: 'file-system',
    type: ExchangeType.DIRECT,
}