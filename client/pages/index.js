import axiosServer from '../axios/axiosServer';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
	console.log(tickets);
	const ticketList = tickets.map((ticket) => {
		return (
			<tr key={ticket.id}>
				<td>{ticket.title}</td>
				<td>{ticket.price}</td>
				<td>
					<Link href={`/tickets/${ticket.id}`}>
						<a>View</a>
					</Link>
				</td>
			</tr>
		);
	});
	return (
		<div>
			<h1>Tickets</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Price</th>
						<th>Link</th>
					</tr>
				</thead>
				<tbody>{ticketList}</tbody>
			</table>
		</div>
	);
};

export async function getServerSideProps(context) {
	const response = await axiosServer.get('/api/tickets', {
		headers: context.req.headers,
	});
	return { props: { tickets: response.data } };
}

export default LandingPage;
