// import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';

const App=()=> {
  // const navigate=useNavigate()
  
  return (<>
   <Routes>
     <Route path='/' exact element={<Login/>}/>
        
     
   </Routes>
   <ToastContainer />
   </>
  );
}

export default App;
