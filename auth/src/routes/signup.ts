import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@anirbantickets/common';
import { User } from '../modals/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new BadRequestError('Email in use');
		}
		const user = User.build({ email, password });
		await user.save();

		// Generate jwt
		const userJwt = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_KEY!
		);
		// Store it in session object

		req.session = {
			jwt: userJwt,
		};

		res.status(201).json({ message: 'User created', user });
	}
);

export { router as signupRouter };
