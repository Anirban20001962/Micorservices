import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY is not defined');
	}
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}
	try {
		await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to database');
	} catch (err) {
		console.error(err);
	}
};

start();

app.listen(3000, () => {
	console.log('Listening on port 3000');
});
