import React from "react"
import MojoAuth from 'mojoauth-web-sdk'
import { Button, Modal } from "semantic-ui-react";
import { useNavigate} from "react-router-dom";
import config from '../config'
const Login = () => {
	const [open, setOpen] = React.useState(false)
    const navigate=useNavigate()
    React.useEffect(()=>{
        
        let mojoConfig={
                language:"en",
                source:[ {type:'email', feature:'magiclink'}],
                redirect_url: config.redirect_url
            }
            
        const mojoauth = new MojoAuth(config.api_key,mojoConfig);
        if(open){
            localStorage.getItem('React-AccessToken')?navigate('/dashboard'):
            mojoauth.signIn().then(payload=>{ 
                setOpen(false); 
                localStorage.setItem('React-AccessToken', payload.oauth.access_token)
                localStorage.setItem('React-Identifier', payload.user.email)
               navigate('/dashboard')
            })
        }
		
			
    },[ navigate, open])
    
    return(<>
    <div className='container'>
        <h1 className='main-title'>MojoAuth React Demo </h1>
        <h3 className="main-subtitle">Read the full article <a target='_blank' rel="noreferrer" href="https://mojoauth.com/blog">here</a></h3>
        {/* <img className="image" src="https://mojoauth.com/docs/api/images/logo-7231aef3.png"/> */}
        <div className='login-container'>
            <h1 className='title'>Welcome</h1>
            <h4 className='subtitle'>Login using MojoAuth</h4>
            <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      dimmer={true}
      basic={true}
      size='tiny'
      trigger={<Button className='login' primary>Login</Button>}
    >
         <div id='mojoauth-passwordless-form'></div>
    </Modal>
    <p className='footer'>By MojoAuth</p>
        </div>
        </div>
    
    </>)
};

export default Login;

