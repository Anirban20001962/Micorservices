import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../modals/ticket';
import { OrderStatus } from '@anirbantickets/common';
import { natsWrapper } from '../../nats-wrapper';
import { Types } from 'mongoose';

it('marks an order as cancelled', async () => {
	// create a ticket with Ticket Model

	const ticket = Ticket.build({
		id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	// make a request to create an order

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);
	// make a request to cancel the order

	const { body: cancelledOrder } = await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(201);
	// expectation to make sure the thing is cancelled
	expect(cancelledOrder.id).toEqual(order.id);
	expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
	// create a ticket with Ticket Model

	const ticket = Ticket.build({
		id: Types.ObjectId().toHexString(),
		title: 'concert',
		price: 20,
	});
	await ticket.save();

	const user = global.signin();
	// make a request to create an order

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);
	// make a request to cancel the order

	await request(app)
		.delete(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(201);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
