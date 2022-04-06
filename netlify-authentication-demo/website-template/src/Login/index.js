import React from "react";
import {Button} from 'semantic-ui-react'
// import MojoAuth from 'mojoauth-web-sdk'
import config from '../config'
const Login = () => {

    return(<>
    <a href={`${config.mojoauth_netlify_url}?redirect_url=${config.redirect_url}`}>
    <Button >Login</Button></a>
        
        
                
        {/* <div>{JSON.stringify(payload, null, 2)}</div> */}

        </>);

};

export default Login;