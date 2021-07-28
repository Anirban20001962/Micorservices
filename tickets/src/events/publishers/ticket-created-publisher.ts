import {
	Publisher,
	Subjects,
	TicketCreatedEvent,
} from '@anirbantickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
