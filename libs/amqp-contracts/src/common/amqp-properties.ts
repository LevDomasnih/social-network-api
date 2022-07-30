import { MessageHandlerOptions } from '@golevelup/nestjs-rabbitmq/lib/rabbitmq.interfaces';

export enum ExchangeType {
    TOPIC = 'topic',
    DIRECT = 'direct',
    FANOUT = 'fanout'
}

export interface CustomMessageHandlerOptions extends Omit<MessageHandlerOptions, 'routingKey'> {
    routingKey: string
}

/**
 * Базовый запрос/сообщение для очереди
 *
 * `MessageType` - тип сообщения - текстовый идентификатор.
 *
 * `PayloadInterface` - интерфейс сообщения.
 */

export interface AmqpBaseMessage<PayloadInterface> {
    /**
     * Тип сообщения
     */
    type: string;

    /**
     * Полезная нагрузка сообщения
     */
    payload: PayloadInterface;

    /**
     * id запроса (формируется инициатором)
     */
    requestId: string;

    /**
     * Штамп времени формирования сообщения
     */
    timestamp: Date;

    /**
     * exchange для ответа
     */
    exchange?: string;

    /**
     * routingKey для ответа
     */
    routingKey?: string;
}
