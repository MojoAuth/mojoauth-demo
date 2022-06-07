function getConfig() {
	return {
		api_key:
			process.env.REACT_APP_API_KEY ||
			'bf24525f-c047-401b-ad1e-47bc3d6adaa8',
			redirect_url:
				process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000/dashboard',
	};
}

export default getConfig();
