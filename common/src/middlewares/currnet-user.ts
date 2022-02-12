import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayLoad {
	id: string;
	email: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayLoad;
		}
	}
}

export const currentUser: RequestHandler = (req, res, next) => {
	if (!req.session?.jwt) {
		return next();
	}
	try {
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayLoad;
		req.currentUser = payload;
	} catch (err) {}
	next();
};
