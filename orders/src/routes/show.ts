import express, { Request, Response } from 'express';
import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@anirbantickets/common';
import { Order } from '../modals/order';

const router = express.Router();

router.get(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const order = await Order.findById(req.params.orderId).populate(
			'ticket'
		);
		if (!order) {
			throw new NotFoundError();
		}
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		res.status(200).json(order);
	}
);

export { router as showOrderRouter };
