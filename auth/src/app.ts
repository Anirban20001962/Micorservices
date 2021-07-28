import express from 'express';
import 'express-async-errors';
import { currentUserRouter } from './routes/current-user';
import { sigininRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@anirbantickets/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(express.json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUserRouter);
app.use(sigininRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
