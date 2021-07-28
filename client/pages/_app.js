import Header from '../componets/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosServer from '../axios/axiosServer';
import axios from 'axios';

const App = ({ Component, pageProps, data }) => {
	return (
		<div style={{ margin: '10px' }}>
			<Header currentUser={data} />
			<div className="container">
				<Component {...pageProps} currentUser={data} />
			</div>
		</div>
	);
};

App.getInitialProps = async (comp) => {
	let response = { data: { currentUser: null } };
	try {
		if (typeof window === 'undefined') {
			response = await axiosServer.get('/api/users/currentuser/', {
				headers: comp.ctx.req.headers,
			});
		} else {
			response = await axios.get('/api/users/currentuser/');
		}
		return { data: response.data };
	} catch (err) {
		return response;
	}
};

export default App;
