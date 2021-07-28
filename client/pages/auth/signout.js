import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const Signout = () => {
	const router = useRouter();
	const { doRequest } = useRequest({
		url: '/api/users/signout',
		method: 'post',
		body: {},
		onSuceess: () => router.push('/'),
	});

	useEffect(() => {
		doRequest();
	}, []);

	return <div>Signout you out...</div>;
};

export default Signout;
