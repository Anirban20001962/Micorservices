import {
	Publisher,
	Subjects,
	TicketUpdatedEvent,
} from '@anirbantickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
