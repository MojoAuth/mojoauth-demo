function getConfig() {
	return {
		image_endpoint: "https://mojoauth.com/assets/images/logo.svg",
		logo_icon_endpoint: "https://mojoauth.com/assets/images/logo-icon.svg",
		api_endpoint: 'http://localhost:3002',
		language: 'en',
		api_key:
			process.env.REACT_APP_API_KEY ||
			'71736bb0-8a9b-4f4d-8503-62355cfb030b',
			redirect_url:
				process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000/dashboard',
	};
}

export default getConfig();
