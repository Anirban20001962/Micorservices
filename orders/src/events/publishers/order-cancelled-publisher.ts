import {
	Subjects,
	Publisher,
	OrderCancelledEvent,
} from '@anirbantickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
