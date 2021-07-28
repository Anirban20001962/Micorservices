import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/',
	timeout: 1000,
});

export default instance;
