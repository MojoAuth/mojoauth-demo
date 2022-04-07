import React from "react";
// import {List} from 'semantic-ui-react'
import MojoAuth from 'mojoauth-web-sdk'
import config from '../config'
const Profile = () => {

    const [payload, setPayload]=React.useState();
    React.useEffect(()=>{

        const mojoauth = new MojoAuth(config.api_key);
		mojoauth.signInWithStateID().then(response =>{
			// if (payload) (window as any).MAEmail=payload.user.identifier
			setPayload(response)
		}); 
    },[]);

    return(<>
        <div id="mojoauth-passwordless-form"></div>
        
        
                
        <pre>{JSON.stringify(payload, null, 2)}</pre>

        </>);

};

export default Profile;