import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../modals/order';
import { Ticket } from '../../modals/ticket';
import { OrderStatus } from '@anirbantickets/common';
import { natsWrapper } from '../../nats-wrapper';
import { Types } from 'mongoose';

it('returns an error if the ticket does not exist', async () => {
	const ticketId = Types.ObjectId().toHexString();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
	const ticket = Ticket.build({
		id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	const order = Order.build({
		userId: 'sdfjsldfjslfj',
		status: OrderStatus.Created,
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(400);
});

it('reserves a ticket', async () => {
	const ticket = Ticket.build({
		id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);
});

it('emits an order created event', async () => {
	const ticket = Ticket.build({
		id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();
	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
