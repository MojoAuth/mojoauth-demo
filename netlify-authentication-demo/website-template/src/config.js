const config={
    api_key: process.env.API_KEY || 'dd69979e-4fba-4445-922d-90f28be17a8e' ||'APIKEY', 
    redirect_url: process.env.REDIRECT_URL || 'netlify-auth-website-template.netlify.app/profile' || 'REDIRECT_URL',
    mojoauth_netlify_url: process.env.MOJOAUTH_NETLIFY_URL || 'mojoauth-netlify-auth.netlify.app' || 'MOJOAUTH NETLIFY URL'
}

export default config