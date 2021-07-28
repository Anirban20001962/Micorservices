import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
	const authResponse = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'test@gamil.com',
			password: 'password',
		})
		.expect(201);
	const cookie = authResponse.get('Set-Cookie');
	const response = await request(app)
		.post('/api/users/signout')
		.set('Cookie', cookie)
		.send({})
		.expect(200);
	console.log(response.get('Set-Cookie'));
	expect(response.get('Set-Cookie')[0]).toBeDefined();
});
