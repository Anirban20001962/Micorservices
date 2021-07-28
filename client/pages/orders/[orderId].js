import axiosServer from '../../axios/axiosServer';
import { useEffect, useState } from 'react';
import StripeCheckOut from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const OrderShow = ({ order, currentUser }) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const router = useRouter();
	const { doRequest, errors } = useRequest({
		url: '/api/payments',
		method: 'post',
		body: {
			orderId: order.id,
		},
		onSuceess: () => router.push('/orders'),
	});
	useEffect(() => {
		const findTimeLeft = () => {
			const msLeft = new Date(order.expiresAt) - new Date();
			setTimeLeft(Math.round(msLeft / 1000));
		};
		findTimeLeft();
		const timerId = setInterval(findTimeLeft, 1000);

		return () => {
			clearInterval(timerId);
		};
	}, []);

	if (timeLeft < 0) {
		return <div>Order Expired</div>;
	}
	return (
		<div>
			Time left to pay: {timeLeft} seconds
			<StripeCheckOut
				token={({ id }) => doRequest({ token: id })}
				stripeKey="pk_test_51JHIqPSDznsqC7s5UiAEi6aZkdyENKwvrWD0lpAWf67EnniYJkTLpJoirUrvcJ9odsVykdfVhFafQqD5CwifEyHm00xgrci8Br"
				amount={order.ticket.price * 100}
				email={currentUser.currentUser.email}
			/>
			{errors}
		</div>
	);
};

export async function getServerSideProps(context) {
	const { orderId } = context.query;
	try {
		const { data } = await axiosServer.get(`/api/orders/${orderId}`, {
			headers: context.req.headers,
		});
		return { props: { order: data } };
	} catch (err) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
}

export default OrderShow;
