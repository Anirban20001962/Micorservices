import { Listener, OrderCreatedEvent, Subjects } from '@anirbantickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../modals/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
		// Find the ticket that the order is reseving

		const ticket = await Ticket.findById(data.ticket.id);
		// If no ticket, throw error

		if (!ticket) {
			throw new Error('Ticket not found');
		}

		// Mark the ticket as being reserved by setting its orderId property

		ticket.set({ orderId: data.id });
		// Save the ticket
		await ticket.save();
		await new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			userId: ticket.userId,
			orderId: ticket.orderId,
			title: ticket.title,
			version: ticket.version,
		});
		// ack the message
		msg.ack();
	}
}
