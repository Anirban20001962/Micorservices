import express, { Request, Response } from 'express';
import {
	requireAuth,
	validateRequest,
	NotFoundError,
	OrderStatus,
	BadRequestError,
} from '@anirbantickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../modals/ticket';
import { Order } from '../modals/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

const router = express.Router();

router.post(
	'/api/orders/',
	requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('ticketId must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;
		// Find the ticket the user is trying to order in the database
		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}
		// Make sure that this ticket is not already reserved
		const isReserved = await ticket.isReserved();

		if (isReserved) {
			throw new BadRequestError('Ticket is already reserved');
		}

		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(
			expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
		);
		// Build the order and save it to the database
		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket,
		});
		await order.save();
		// Publish an event saying that an order was created

		new OrderCreatedPublisher(natsWrapper.client).publish({
			id: order.id,
			status: order.status,
			userId: order.userId,
			expiresAt: order.expiresAt.toISOString(),
			version: order.version,
			ticket: {
				id: ticket.id,
				price: ticket.price,
			},
		});
		res.status(201).json(order);
	}
);

export { router as newOrderRouter };
