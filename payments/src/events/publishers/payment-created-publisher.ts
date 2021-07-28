import {
	Subjects,
	Publisher,
	PaymentCreatedEvent,
} from '@anirbantickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
