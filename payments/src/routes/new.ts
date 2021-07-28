import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
	requireAuth,
	validateRequest,
	BadRequestError,
	NotFoundError,
	NotAuthorizedError,
	OrderStatus,
} from '@anirbantickets/common';
import { Order } from '../modal/order';
import { stripe } from '../stripe';
import { Payment } from '../modal/payments';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/payments',
	requireAuth,
	[body('token').not().isEmpty(), body('orderId').not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError('Cannot pay for an cancelled order');
		}
		const charge = await stripe.charges.create({
			currency: 'usd',
			amount: order.price * 100,
			source: token,
			description: `User of id${order.userId} is buying a ticket of price $${order.price}`,
			shipping: {
				name: 'Jenny Rosen',
				address: {
					line1: '9b sarat ghosh garden road',
					postal_code: '700031',
					city: 'Kolkata',
					state: 'West Bengal',
					country: 'ID',
				},
			},
		});

		const payment = Payment.build({
			orderId: order.id,
			stripeId: charge.id,
		});
		await payment.save();
		new PaymentCreatedPublisher(natsWrapper.client).publish({
			id: payment.id,
			orderId: payment.orderId,
			stripeId: payment.stripeId,
		});
		res.status(201).json(payment);
	}
);

export { router as createChargeRouter };
