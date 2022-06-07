
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
const params = search
			? QueryString.parse(search.search)
			:{}
  useEffect(() => {
    if (params.state_id) {
        const mojoauth = new MojoAuth(config.api_key);
        mojoauth.signInWithStateID(params.state_id).then((payload) => {
            
            localStorage.setItem('React-AccessToken', payload.oauth.access_token)
            localStorage.setItem('React-Identifier', payload.user.identifier)
navigate('/dashboard')
        });
    }else if(!localStorage.getItem('React-AccessToken')){
      navigate('/')
    }
  }, []);

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