import { Publisher, OrderCreatedEvent, Subjects } from '@anirbantickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
