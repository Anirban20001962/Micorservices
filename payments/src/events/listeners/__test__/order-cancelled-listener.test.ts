import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../modal/order';
import { Types } from 'mongoose';
import { OrderStatus, OrderCancelledEvent } from '@anirbantickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
	const listener = new OrderCancelledListener(natsWrapper.client);

	const order = Order.build({
		id: Types.ObjectId().toHexString(),
		version: 0,
		userId: Types.ObjectId().toHexString(),
		price: 20,
		status: OrderStatus.Created,
	});
	await order.save();
	const data: OrderCancelledEvent['data'] = {
		id: order.id,
		version: 1,
		ticket: {
			id: Types.ObjectId().toHexString(),
			price: order.price,
		},
	};
	//@ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { listener, data, msg, order };
};

it('updates the status of the order', async () => {
	const { listener, data, msg, order } = await setup();

	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);

	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
	const { listener, data, msg } = await setup();

	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
