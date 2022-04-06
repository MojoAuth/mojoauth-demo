import React from 'react';
// import './App.css';
import { Route,Routes } from "react-router-dom";
import Profile from './Profile';
import Login from './Login';
// import { } from "react-router-dom";
const App = () => {
  return (
    <div className = "App">
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