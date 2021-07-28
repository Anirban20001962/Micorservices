import axiosServer from '../../axios/axiosServer';
import useRequest from '../../hooks/use-request';
import { useRouter } from 'next/router';

const TicketShow = ({ ticket }) => {
	const router = useRouter();
	const { doRequest, errors } = useRequest({
		url: '/api/orders',
		method: 'post',
		body: {
			ticketId: ticket.id,
		},
		onSuceess: (order) => router.push(`/orders/${order.id}`),
	});
	return (
		<div>
			<h1>{ticket.title}</h1>
			<h4>Price: ${ticket.price}</h4>
			{errors}
			<button className="btn btn-primary" onClick={() => doRequest()}>
				Purchase
			</button>
		</div>
	);
};

export async function getServerSideProps(context) {
	const { ticketId } = context.query;
	try {
		const { data } = await axiosServer.get(`/api/tickets/${ticketId}`, {
			headers: context.req.headers,
		});
		return { props: { ticket: data } };
	} catch (err) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
}

export default TicketShow;
