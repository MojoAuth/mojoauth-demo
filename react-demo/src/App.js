// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Login from './Login';



const App=()=> {
  // const navigate=useNavigate()
  
  return (
   <Routes>
     <Route path='/' exact element={<Login/>}/>
        
     <Route path='/dashboard' exact element={<Dashboard/>}/>
   </Routes>
  );
}

export default App;
