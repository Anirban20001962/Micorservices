import { Types } from 'mongoose';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@anirbantickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../modals/ticket';

const setup = async () => {
	// Create an instance of the listener
	const listener = new TicketCreatedListener(natsWrapper.client);
	// create a fake data event
	const data: TicketCreatedEvent['data'] = {
		version: 0,
		id: Types.ObjectId().toHexString(),
		price: 10,
		userId: new Types.ObjectId().toHexString(),
		title: 'concert',
	};
	// create a fake message object
	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
	const { listener, data, msg } = await setup();
	// call the onMessage function with data object + message object
	await listener.onMessage(data, msg);
	// write assertions to make sure a ticket was created!
	const ticket = await Ticket.findById(data.id);

	expect(ticket).toBeDefined();
	expect(ticket!.title).toEqual(data.title);
	expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();
	// call the onMessage function with data object + message object
	await listener.onMessage(data, msg);
	// write assertions to make sure ack function is called
	expect(msg.ack).toHaveBeenCalled();
});
