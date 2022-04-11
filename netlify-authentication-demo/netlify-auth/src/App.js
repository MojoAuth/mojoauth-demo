// import logo from './logo.svg';
import React from 'react'
import './App.css';
import MojoAuth from 'mojoauth-web-sdk'
// import { useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';
import config from './config'
import {Helmet} from 'react-helmet'
function App() {

  const search = window.location.search
  const params = QueryString.parse(search);
  React.useEffect(()=>{
    const mojoConfig = {
      language: 'en',
      redirect_url: params.redirect_url ,
      source: [{type: 'email', feature: 'magiclink'}]
    }
    const mojoauth = new MojoAuth(config.api_key, mojoConfig);
mojoauth.signIn().then(response =>{
  window.close()
  // if (payload) (window as any).MAEmail=payload.user.identifier
}); 
},[params]);
  return (
    <><Helmet>
    <meta charSet='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>Netlify Authentication - MojoAuth</title>
    <meta name='theme-color' content='#000000' />
  </Helmet><div id='mojoauth-passwordless-form'></div></>
  );
}

export default App;
