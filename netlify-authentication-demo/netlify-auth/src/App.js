// import logo from './logo.svg';
import React from 'react'
import './App.css';
import MojoAuth from 'mojoauth-web-sdk'
// import { useLocation } from 'react-router-dom';
import * as QueryString from 'query-string';
import config from './config'
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
    <div id='mojoauth-passwordless-form'></div>
  );
}

export default App;
