const config={
    api_key: process.env.API_KEY  ||'APIKEY', 
    redirect_url: process.env.REDIRECT_URL || 'REDIRECT_URL',
    mojoauth_netlify_url: process.env.MOJOAUTH_NETLIFY_URL || 'MOJOAUTH NETLIFY URL'
}

export default config