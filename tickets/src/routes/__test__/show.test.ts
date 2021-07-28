import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`);
});

it('returns ticket if the ticket is found', async () => {
	const title = 'concert';
	const price = 20;
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title, price })
		.expect(201);

	const ticketingResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.expect(200);
	expect(ticketingResponse.body.title).toEqual(title);
	expect(ticketingResponse.body.price).toEqual(price);
});
