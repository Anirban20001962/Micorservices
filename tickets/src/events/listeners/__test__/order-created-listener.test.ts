import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../modals/ticket';
import { OrderCreatedEvent, OrderStatus } from '@anirbantickets/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);

	// Create and save a ticket
	const ticket = Ticket.build({
		title: 'concert',
		price: 99,
		userId: 'asdf',
	});

	await ticket.save();
	// Create the fake data event
	const data: OrderCreatedEvent['data'] = {
		id: Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: Types.ObjectId().toHexString(),
		expiresAt: '',
		ticket: {
			id: ticket.id,
			price: ticket.price,
		},
	};
	// Fake message object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { data, ticket, listener, msg };
};

it('sets the userId of the ticket', async () => {
	const { listener, data, msg, ticket } = await setup();
	await listener.onMessage(data, msg);
	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);
	expect(natsWrapper.client.publish).toHaveBeenCalled();

	const ticketUpdatedData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);

	expect(ticketUpdatedData.orderId).toEqual(data.id);
});
