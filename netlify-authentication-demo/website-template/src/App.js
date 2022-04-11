import React from 'react';
// import './App.css';
import { Route,Routes } from "react-router-dom";
import Profile from './Profile';
import Login from './Login';
import {Helmet} from 'react-helmet'
// import { } from "react-router-dom";
const App = () => {
  return (
    <div className = "App">
      <Helmet>
    <meta charSet='utf-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <title>Netlify Centralized Authentication Demo - MojoAuth</title>
    <meta name='theme-color' content='#000000' />
  </Helmet>
      <React.Fragment>
        <Routes>
          {/* <Route path='/'>
            <Navigate to='/login'/>
          </Route> */}
          <Route path='/' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
          
        </Routes>

      </React.Fragment>
    </div>
  )
}


export default App;