
import React, { useEffect } from "react";
import MojoAuth from "mojoauth-web-sdk";
import config from '../config'
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";
import * as QueryString from 'query-string';
//redux
// actions


const Dashboard = (props) => {
//   const [payload, setPayload] = useState(null);
const navigate = useNavigate();
const search = useLocation();
  useEffect(() => {
    

    const params = search
			? QueryString.parse(search.search)
			:{}
    if (params.state_id) {
        const mojoauth = new MojoAuth(config.api_key);
        //react-hooks/exhaustive-deps
        mojoauth.signInWithStateID(params.state_id).then((payload) => {
            
            localStorage.setItem('React-AccessToken', payload.oauth.access_token)
            localStorage.setItem('React-Identifier', payload.user.email)
navigate('/dashboard')
        });
    }else if(!localStorage.getItem('React-AccessToken')){
      //react-hooks/exhaustive-deps
      navigate('/')
    }
  }, [ search,navigate]);

  return (
    <React.Fragment>
       <div className='container'>
        <h1 className='main-title'>MojoAuth React Demo Dashboard </h1>
        <h3 className="main-subtitle">You have been Logged in Successfully!!</h3>
        <div className='login-container'>
            <h1 className='title'>Welcome </h1>
            <h4 className='subtitle'>{localStorage.getItem('React-Identifier')}</h4>
            <Button className='login' primary onClick={()=>{
        localStorage.removeItem('React-AccessToken');
        navigate('/')
      }}>Logout</Button>
    <p className='footer'>By MojoAuth</p>
        </div>
        </div>
      
    </React.Fragment>
  );
};

export default Dashboard;