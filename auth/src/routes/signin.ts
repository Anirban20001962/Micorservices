import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@anirbantickets/common';
import { User } from '../modals/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be between 4 and 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError('Invalid credentials');
		}
		const passwordsMatch = Password.compare(
			existingUser.password,
			password
		);
		if (!passwordsMatch) {
			throw new BadRequestError('InvalidCredentials');
		}
		// Generate jwt
		const userJwt = jwt.sign(
			{ id: existingUser.id, email: existingUser.email },
			process.env.JWT_KEY!
		);
		// Store it in session object

		req.session = {
			jwt: userJwt,
		};

		res.status(200).json({
			message: 'Successfully Logged In',
			user: existingUser,
		});
	}
);

export { router as sigininRouter };
