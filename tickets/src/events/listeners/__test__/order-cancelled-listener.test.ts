import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../modals/ticket';
import { Types } from 'mongoose';
import { OrderCancelledEvent } from '@anirbantickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);
	const orderId = Types.ObjectId().toHexString();
	const ticket = await Ticket.build({
		title: 'concert',
		price: 20,
		userId: 'asdf',
		orderId,
	});
	await ticket.save();

	const data: OrderCancelledEvent['data'] = {
		id: orderId,
		version: ticket.version,
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	return { listener, data, ticket, orderId, msg };
};

it('updates the ticket, publisges an event, and acks the message', async () => {
	const { msg, data, ticket, orderId, listener } = await setup();

	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).not.toBeDefined();
	expect(msg.ack).toHaveBeenCalled();
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
