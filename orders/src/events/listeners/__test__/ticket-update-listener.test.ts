import { TicketUpdatedListener } from '../../listeners/ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../modals/ticket';
import { Types } from 'mongoose';
import { TicketUpdatedEvent } from '@anirbantickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	// Create a listener
	const listener = new TicketUpdatedListener(natsWrapper.client);
	// Create and save a ticket
	const ticket = Ticket.build({
		id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});

	await ticket.save();

	// Create a fake data object
	const data: TicketUpdatedEvent['data'] = {
		id: ticket._id,
		version: ticket.version + 1,
		title: 'new concert',
		price: 999,
		userId: Types.ObjectId().toHexString(),
	};
	// Create a fake msg object
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	// return all of this stuff
	return { msg, data, ticket, listener };
};

it('finds, updates and saves a ticket', async () => {
	const { listener, data, ticket, msg } = await setup();
	await listener.onMessage(data, msg);
	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket).toBeDefined();
	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
	const { msg, data, listener, ticket } = await setup();
	data.version = 10;
	try {
		await listener.onMessage(data, msg);
	} catch (err) {}
	expect(msg.ack).not.toHaveBeenCalled();
});
