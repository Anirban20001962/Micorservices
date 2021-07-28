module.exports = {
	/* config options here */
	webpackDevMiddleware: (config) => {
		config.watchOptions.poll = 300;
		return config;
	},
};
