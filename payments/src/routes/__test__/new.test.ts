import request from 'supertest';
import { app } from '../../app';
import { Types } from 'mongoose';
import { Order } from '../../modal/order';
import { OrderStatus } from '@anirbantickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../modal/payments';

it('returns a 401 when purchasing an order that does not exist', async () => {
	await request(app)
		.post('/api/paymensts')
		.set('Cookie', global.signin())
		.send({
			token: 'dfhsdkfh',
			orderId: Types.ObjectId().toHexString(),
		})
		.expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
	const order = Order.build({
		id: Types.ObjectId().toHexString(),
		userId: Types.ObjectId().toHexString(),
		version: 0,
		price: 20,
		status: OrderStatus.Created,
	});
	await order.save();
	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin())
		.send({
			token: 'aslfsdfj',
			orderId: order.id,
		})
		.expect(401);
});

it('returns a 400 when puchasing a cancelled order', async () => {
	const userId = Types.ObjectId().toHexString();

	const order = Order.build({
		id: Types.ObjectId().toHexString(),
		userId,
		version: 0,
		price: 20,
		status: OrderStatus.Cancelled,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin(userId))
		.send({
			token: 'sfshfkjf',
			orderId: order.id,
		})
		.expect(400);
});

it('returns a 204 with valid inputs', async () => {
	const userId = Types.ObjectId().toHexString();

	const order = Order.build({
		id: Types.ObjectId().toHexString(),
		userId,
		version: 0,
		price: 20,
		status: OrderStatus.Created,
	});

	await order.save();

	await request(app)
		.post('/api/payments')
		.set('Cookie', global.signin(userId))
		.send({
			token: 'tok_visa',
			orderId: order.id,
		})
		.expect(201);

	const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
	expect(chargeOptions.source).toEqual('tok_visa');
	expect(chargeOptions.amount).toEqual(order.price * 100);
	expect(chargeOptions.currency).toEqual('usd');

	const payment = await Payment.findOne({
		orderId: order.id,
	});

	expect(payment).not.toBeNull();
});
