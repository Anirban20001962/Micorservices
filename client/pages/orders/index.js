import axiosServer from '../../axios/axiosServer';
import Link from 'next/link';

const OrderIndex = ({ orders }) => {
	return (
		<ul>
			{orders.map((order) => {
				return (
					<li key={order.id}>
						{order.status !== 'complete' ? (
							<Link href={`/orders/${order.id}`}>
								<a>{order.ticket.title}</a>
							</Link>
						) : (
							`${order.ticket.title}`
						)}
						- {order.status}
					</li>
				);
			})}
		</ul>
	);
};

export async function getServerSideProps(context) {
	try {
		const { data } = await axiosServer.get('/api/orders', {
			headers: context.req.headers,
		});
		return { props: { orders: data } };
	} catch (err) {
		console.log(err);
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}
}

export default OrderIndex;
