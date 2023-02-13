// import React from "react"
// import MojoAuth from 'mojoauth-web-sdk'
// // import { Button, Modal } from "semantic-ui-react";
// import { useNavigate} from "react-router-dom";
// import { toast } from 'react-toastify';
// import config from '../config'
// const Login = () => {
// 	const [disabled, setDisabled] = React.useState(true)

//     const navigate=useNavigate()
//     React.useEffect(()=>{

//         let mojoConfig={
//                 language:"en",
//                 source:[ {type:'email', feature:'magiclink'}],
//                 redirect_url: config.redirect_url
//             }

//         const mojoauth = new MojoAuth(config.api_key,mojoConfig);
//             localStorage.getItem('React-AccessToken')?navigate('/dashboard'):
//             mojoauth.signIn().then(payload=>{ 
//                 // setOpen(false); 
//                 localStorage.setItem('React-AccessToken', payload.oauth.access_token)
//                 localStorage.setItem('React-Identifier', payload.user.identifier)
//                navigate('/dashboard')
//             })
//             const handleChange =()=>{
//                 console.log(document.getElementsByClassName("input-control")[1])
//                 document.getElementsByClassName("input-control")[1].addEventListener('click', ()=>{
//                     console.log("clicking")
//                     if(disabled){
//                         toast.error("You can only login using the domain @asurion")
//                     }
//                 })

//                 document.getElementById('mojoauth-passwordless-form').removeEventListener('change', handleChange)
//                 document.getElementsByClassName("btn btn-primary")[0].disabled = true
//                 setDisabled(true)
//                 document.getElementById('mojoauth-passwordless-email').addEventListener('input', ()=>{

//                     if(document.getElementById('mojoauth-passwordless-email').value.split("@")[1]==="abcd.com"){

//                         document.getElementsByClassName("btn btn-primary")[0].disabled = false
//                         setDisabled(false) 

//                     }else {
//                         document.getElementsByClassName("btn btn-primary")[0].disabled = true
//                         setDisabled(true)
//                     }
//                 })
//             }
//             document.getElementById('mojoauth-passwordless-form').addEventListener('change', handleChange)



//     },[ navigate])

//     return(<>

//     <div id='mojoauth-passwordless-form'></div>


//     </>)
// };

// export default Login;



import React from "react"
import { Button,Form } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import config from '../config'
// import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'
const Login = () => {

    const [ email,setEmail ] = React.useState( "" )
    const [ phone,setPhone ] = React.useState( "" )

    const [stateID, setStateID] = React.useState("")
    const [ OTP,setOTP ] = React.useState( "" )
    const [ loading,setLoading ] = React.useState( false )
    const [ verify,setVerify ] = React.useState( false )
    const [verifyToken, setVerifyToken] = React.useState(false)
    const [OTPError, setOTPError] = React.useState( false )
    const [resendTimer, setResendTimer] = React.useState( false )
    const [timeLeft, setTimeLeft] = React.useState(30)
    
    const navigate = useNavigate()

    const emailOTPURL = `${ config.api_endpoint }/emailotp`
    const phoneOTPURL = `${ config.api_endpoint }/phoneotp`
    const emailOTPVerifyURL = `${ config.api_endpoint}/emailotp/verify`
    const phoneOTPVerifyURL = `${ config.api_endpoint}/phoneotp/verify`
    const resendEmailOTPURL = `${ config.api_endpoint }/emailotp/resend`
    const resendPhoneOTPURL = `${ config.api_endpoint }/phoneotp/resend`
    // const tokenVerifyURL = `${ config.api_endpoint }/token/verify`


    React.useEffect(() =>{

    },[navigate])

    const handleEmailOTPLogin = () => {
        
        setLoading(true)
        axios.post(
            emailOTPURL,
            {
                email: email
            },
            {
                params: {
                    language: config.language,
                    redirect_url: config.redirect_url,
                },
                headers: {
                    'X-API-Key': config.api_key,
                },
            } ).then( response => {
                console.log(response)
                if ( response.data.state_id ) {
                    setVerify( true )
                    setLoading(false)
                    setStateID(response.data.state_id)
                    console.log( response.data.state_id )
                    toast.success("OTP sent successfully!")
                }
                else if(response.data.error){
                    console.log(response.data.error)

                    toast.error(response.data.error)
                    setLoading(false)
                }
            } ).catch((error)=>{
                toast.error(error.response.data)
                console.log(error.response.data)
                setLoading(false)
            })
    }

    const handlePhoneOTPLogin = () => {
        
        setLoading(true)
        axios.post(
            phoneOTPURL,
            {
                phone: phone
            },
            {
                params: {
                    language: config.language,
                },
                headers: {
                    'X-API-Key': config.api_key,
                },
            } ).then( response => {
                console.log(response)
                if ( response.data.state_id ) {
                    setVerify( true )
                    setLoading(false)
                    setStateID(response.data.state_id)
                    console.log( response.data.state_id )
                    toast.success("OTP sent successfully!")
                }
                else if(response.data.error){
                    console.log(response.data.error)

                    toast.error(response.data.error)
                    setLoading(false)
                }
            } ).catch((error)=>{
                toast.error(error.response.data)
                console.log(error.response.data)
                setLoading(false)
            })
    }
    const handleOTPVerifyLogin = (OTP)=>{

        setLoading(true)
        axios.post(
            emailOTPVerifyURL,
            {
                state_id: stateID,
                otp: OTP,
            },
            {
                headers: {
                    'X-API-Key': config.api_key,
                },
            } ).then( response => {
                console.log(response.data)
                if(response.data.isValid){
                    
                    localStorage.setItem("React-AccessToken", response.data.access_token)
                    
                    
                    toast.success('You have been logged in successfully!')
                    setVerifyToken(true)
                    
                    setLoading(false)
                }else if(response.data.code===913){
                    setOTPError(true)
                    setTimeout(() =>  {setOTPError(false)},3000)
                    
                    setLoading(false)
                    toast.error(response.data.message)
                }
               
               
            } ).catch((error)=>{
                toast.error(error.response.data)
                console.log(error.response.data)
                setLoading(false)
            })
    }

    const handlePhoneOTPVerifyLogin = (OTP)=>{

        setLoading(true)
        axios.post(
            phoneOTPVerifyURL,
            {
                state_id: stateID,
                otp: OTP,
            },
            {
                headers: {
                    'X-API-Key': config.api_key,
                },
            } ).then( response => {
                console.log(response.data)
                if(response.data.isValid){
                    
                    localStorage.setItem("React-AccessToken", response.data.access_token)
                    
                    
                    toast.success('You have been logged in successfully!')
                    setVerifyToken(true)
                    
                    setLoading(false)
                }else if(response.data.code===913){
                    setOTPError(true)
                    setTimeout(() =>  {setOTPError(false)},3000)
                    
                    setLoading(false)
                    toast.error(response.data.message)
                }
               
               
            } ).catch((error)=>{
                toast.error(error.response.data)
                console.log(error.response.data)
                setLoading(false)
            })
    }

    const handleResendOTP = () => {

        setResendTimer(true)
		let timerInterval = null;
		setTimeLeft(30)
        let timePassed = 0;
        timerInterval = setInterval(() => {
			
			// The amount of time passed increments by one
			setTimeLeft((timeLeft)=>timeLeft-1)
            timePassed=timePassed+1;
			// The time left label is updated
			if (timePassed<30)
			{
                console.log(timePassed)
			}
			else if(timePassed>30){
                console.log("<0")
				clearInterval(timerInterval)
                setResendTimer(false)
			}
		}, 1000);
        setLoading(true)
        axios.post(
            resendEmailOTPURL,
            {
                state_id: stateID,
            },
            {
                params: {
                    language: config.language,
                    redirect_url: config.redirect_url,
                },
                headers: {
                    'X-API-Key': config.api_key,
                },
            } ).then( response => {
                if(response.data.state_id){
                    
                    toast.success('OTP resent successfully!')
                    setLoading(false)
                }else {
                    setLoading(false)
                    toast.error(response.data.error)
                }
               
               
            } ).catch((error)=>{
                toast.error(error.response.data)
                console.log(error.response.data)
                setLoading(false)
            })

    }

    const handleResendPhoneOTP = () => {

        setResendTimer(true)
		let timerInterval = null;
		setTimeLeft(30)
        let timePassed = 0;
        timerInterval = setInterval(() => {
			
			// The amount of time passed increments by one
			setTimeLeft((timeLeft)=>timeLeft-1)
            timePassed=timePassed+1;
			// The time left label is updated
			if (timePassed<30)
			{
                console.log(timePassed)
			}
			else if(timePassed>30){
                console.log("<0")
				clearInterval(timerInterval)
                setResendTimer(false)
			}
		}, 1000);
        setLoading(true)
        axios.post(
            resendPhoneOTPURL,
            {
                state_id: stateID,
            },
            {
                params: {
                    language: config.language,
                },
                headers: {
                    'X-API-Key': config.api_key,
                },
            } ).then( response => {
                if(response.data.state_id){
                    
                    toast.success('OTP resent successfully!')
                    setLoading(false)
                }else {
                    setLoading(false)
                    toast.error(response.data.error)
                }
               
               
            } ).catch((error)=>{
                toast.error(error.response.data)
                console.log(error.response.data)
                setLoading(false)
            })

    }

   const formatTimeLeft = (time) => {
        // The largest round integer less than or equal to the result of time divided being by 60.
        const minutes = Math.floor(time / 60);
        
        // Seconds are the remainder of the time divided by 60 (modulus operator)
        let seconds= time % 60;
        // If the value of seconds is less than 10, then display seconds with a leading zero
      
        // The output in MM:SS format
        return `${(minutes).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${(seconds).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`;
      }



    return ( <>
        
        <div className='container'>
            
                
                    <h1 className='main-title'>MojoAuth React Demo </h1>
                    <h3 className="main-subtitle">Login with specific domain</h3>
                    <div className='login-container'>
                        <img width="150px" alt='mojoauth' src={config.image_endpoint}/>
                        {!verify ? <>
                        <h1 className='title'>Welcome to the Company</h1>
                        <Form>
                            <Form.Input
                                label='Email'
                                className='input'
                                type='text'
                                placeholder='Enter Your Email Address'
                                name='email'
                                value={ phone }
                                onChange={ ( e ) => {
                                    setPhone( e.target.value );
                                } }
                            />
                            <Button
                                className='login'
                                loading={ loading }
                                primary
                                onClick={ handlePhoneOTPLogin }
                            >
                                { ' ' }
                                Sign in without password{ ' ' }
                            </Button>
                            {/* <Toaster /> */}
                            <ToastContainer/>
                        </Form>

                        <div className='footer'>
                        <p style={{ margin: "0 auto", paddingRight: "8px"}}>By MojoAuth </p> 
                        <img width="15px"  alt='mojoauth' src={config.logo_icon_endpoint} />
                        </div>
                        
                </>
                    :!verifyToken?
                    <>
                    {
                        
                        (
                            <>
                                
                                <h1 className='title'>OTP Verification</h1>
                                    <h4 className="subtitle">{`Enter the OTP sent at ${email}`}</h4>
                                    
                                    <Form>
                                        
                                        <Form.Input
                                            label='OTP'
                                            className='input'
                                            type='text'
                                            name='otp'
                                            value={ OTP }
                                            onChange={ ( e ) => {
                                                setOTP( e.target.value );
                                            } }
                                        />
                                        {OTPError?<h5 style={{color:"red"}}>Please enter the correct otp and try again</h5>:null}
                                        <Button
                                            className='login'
                                            loading={ loading }
                                            primary
                                            onClick={ ()=>{handlePhoneOTPVerifyLogin(OTP)} }
                                        >
                                            { ' ' }
                                            Submit{ ' ' }
                                        </Button>
                                        {/* <Toaster /> */}
                                        <ToastContainer/>
                                                
                                    </Form>
                                    <div className='resend-text'>
                                        {!resendTimer?
                                            <>
                                                <p>
                                                    Didn't receive OTP?
                                                </p> {' '}
                                                <p className="resend" onClick={handleResendPhoneOTP}>
                                                   {' '} Resend
                                                </p>
                                            </>
                                            :
                                            <p className ="disabled">
                                                Resend OTP again in {formatTimeLeft(timeLeft)}
                                            </p>
                                        }
                                    </div>
                                    <div className='footer'>
                        <p style={{ margin: "0 auto", paddingRight: "8px"}}>By MojoAuth </p> 
                        <img width="15px" alt='mojoauth' src={config.logo_icon_endpoint} />
                        </div>
                                
                                
                            </>)

                    }

                    
                    </>
                    :
                    <>
                                
                                
                                <h1 className='title'>Welcome {email}</h1>
                                    <h4 className="subtitle">You have successfully logged in!</h4>
                                    <div className='footer'>
                        <p style={{ margin: "0 auto", paddingRight: "8px"}}>By MojoAuth </p> 
                        <img width="15px" alt='mojoauth' src={config.logo_icon_endpoint} />
                        </div>
                                
                                
                            </>
                    
            }
        </div>

        {verifyToken?<div> <h3>Token :</h3><p className="token">{localStorage.getItem("React-AccessToken")}</p></div>:null}
        
       
            </div>
    </> )

}

export default Login