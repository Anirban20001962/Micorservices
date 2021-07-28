import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on suceesful signup', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
});

it('it returns a 400 with an invalid email', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'testfsklfskj',
			password: 'password',
		})
		.expect(400);
});

it('it returns a 400 with an password', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'testfsklfskj',
			password: 'p',
		})
		.expect(400);
});

it('it returns a 400 with missing email and password', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({ email: 'test@gmail.com' })
		.expect(400);
	await request(app)
		.post('/api/users/signup')
		.send({ password: 'pfsfhskdfhsk' })
		.expect(400);
});

it('disallows duplicate emails', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(400);
});

it('sets a cookie after successfull signup', async () => {
	const response = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@test.com',
			password: 'password',
		})
		.expect(201);
	expect(response.get('Set-Cookie')).toBeDefined();
});
