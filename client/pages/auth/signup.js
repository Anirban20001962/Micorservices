import { useState } from 'react';
import useRequset from '../../hooks/use-request';
import { useRouter } from 'next/router';

const Signup = () => {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const { doRequest, errors } = useRequset({
		url: '/api/users/signup',
		method: 'post',
		body: {
			email,
			password,
		},
		onSuceess: () => router.push('/'),
	});
	const onSubmit = async (event) => {
		event.preventDefault();
		await doRequest();
	};
	return (
		<form onSubmit={onSubmit}>
			<h1>Sign Up</h1>
			<div className="form-group mb-3">
				<label>Email Address</label>
				<input
					className="form-control"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="form-group mb-3">
				<label>Password</label>
				<input
					className="form-control"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			{errors}
			<button className="btn btn-primary">Sign Up</button>
		</form>
	);
};

export default Signup;
