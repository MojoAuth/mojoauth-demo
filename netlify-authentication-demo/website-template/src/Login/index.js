import React from "react";
import {Button} from 'semantic-ui-react'
// import MojoAuth from 'mojoauth-web-sdk'
import config from '../config'
// import 'semantic-ui-css/semantic.min.css'
const Login = () => {

    return(<>
    <div className='container'>
        <h1 className='main-title'>Host Central Authentication at Netlify</h1>
        <h3 className="main-subtitle">Read the full article <a target='_blank' rel="noreferrer" href="https://mojoauth.com/blog">here</a></h3>
        <div className='login-container'>
            <h1 className='title'>Welcome</h1>
            <h4 className='subtitle'>Login using Netlify centered Authentication</h4>
    <a target='_blank' rel="noreferrer" href={`https://${config.mojoauth_netlify_url}?redirect_url=${config.redirect_url}`}>
    <Button primary>Login</Button></a>
    <p className='footer'>By MojoAuth</p>
        </div>
        </div>
        
                
        {/* <div>{JSON.stringify(payload, null, 2)}</div> */}

        </>);

};

export default Login;