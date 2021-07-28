import axios from 'axios';
import { useState } from 'react';

function useRequset({ url, method, body, onSuceess }) {
	const [errors, setErrors] = useState(null);
	const doRequest = async (props = {}) => {
		try {
			const response = await axios[method](url, { ...body, ...props });
			if (onSuceess) {
				onSuceess(response.data);
			}
			return response.data;
		} catch (err) {
			setErrors(
				<div className="alert alert-danger">
					<h4>Ooops....</h4>
					<ul className="my-0">
						{err.response.data.errors.map((err, index) => (
							<li key={index}>{err.message}</li>
						))}
					</ul>
				</div>
			);
		}
	};
	return { doRequest, errors };
}

export default useRequset;
