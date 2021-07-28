import { useState } from 'react';
import useRequset from '../../hooks/use-request';
import { useRouter } from 'next/router';

const NewTicket = () => {
	const [title, setTitle] = useState('');
	const [price, setPrice] = useState('');
	const router = useRouter();
	const { doRequest, errors } = useRequset({
		url: '/api/tickets',
		method: 'post',
		body: {
			title,
			price,
		},
		onSuceess: () => router.push('/'),
	});
	const onSubmit = (event) => {
		event.preventDefault();

		doRequest();
	};
	const onBlur = () => {
		const value = +price;
		if (isNaN(value)) {
			return;
		}
		setPrice(value.toFixed(2));
	};
	return (
		<div>
			<h1>Create a ticket</h1>
			<form onSubmit={onSubmit}>
				<div className="form-group mb-3">
					<label>Title</label>
					<input
						className="form-control"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</div>
				<div className="form-group mb-3">
					<label>Price</label>
					<input
						className="form-control"
						type="text"
						value={price}
						onBlur={onBlur}
						onChange={(e) => setPrice(e.target.value)}
					/>
				</div>
				{errors}
				<button className="btn btn-primary">Submit</button>
			</form>
		</div>
	);
};

export default NewTicket;
