import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@anirbantickets/common';
import { Types } from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../modal/order';

const setup = async () => {
	const listener = new OrderCreatedListener(natsWrapper.client);
	const data: OrderCreatedEvent['data'] = {
		id: Types.ObjectId().toHexString(),
		version: 0,
		status: OrderStatus.Created,
		userId: Types.ObjectId().toHexString(),
		expiresAt: 'sfjslfj',
		ticket: {
			id: Types.ObjectId().toHexString(),
			price: 20,
		},
	};
	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	return { listener, data, msg };
};

it('replicated the order info', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	const order = await Order.findById(data.id);

	expect(order).toBeDefined();
	expect(order!.price).toEqual(data.ticket.price);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
