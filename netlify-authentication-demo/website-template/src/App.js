import React from 'react';
// import './App.css';
import { Route,Routes } from "react-router-dom";
import Profile from './Profile';
import Login from './Login';
const App = () => {
  return (
    <div className = "App">
      <React.Fragment>
        <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>

      </React.Fragment>
    </div>
  )
}


export default App;