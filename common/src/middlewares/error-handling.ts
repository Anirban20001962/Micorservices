import { ErrorRequestHandler } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof CustomError) {
		return res
			.status(err.statusCode)
			.json({ errors: err.serializeErrors() });
	}
	console.log(err);
	res.status(500).json({ errors: [{ message: 'Something went wrong' }] });
};
