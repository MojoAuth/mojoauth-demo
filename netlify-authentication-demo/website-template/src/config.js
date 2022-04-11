const config={
    api_key: process.env.REACT_APP_API_KEY  ||'APIKEY', 
    redirect_url: process.env.REACT_APP_REDIRECT_URL || 'REDIRECT_URL',
    mojoauth_netlify_url: process.env.REACT_APP_MOJOAUTH_NETLIFY_URL ||  'MOJOAUTH NETLIFY URL'
}

export default config