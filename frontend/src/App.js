import logo from './logo.svg';
// import './App.css';f
import Loginpage from '../src/components/Loginpage.js'
import AddTransaction from './components/AddTransaction.js';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  BrowserRouter
} from "react-router-dom";
import Table from './components/Table';
import { useEffect , useState } from 'react';

const App = ()=> {
  
    const [accessToken , setAccessToken] = useState('')

useEffect(()=>{
  setAccessToken(localStorage.getItem("accessToken"))
})



  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={!accessToken ? <Loginpage /> : <Home />} />
        <Route path="/Home" element={!accessToken ? <Loginpage /> : <Home />} />
        <Route path="/add_transaction" element={!accessToken ? <Loginpage /> : <AddTransaction />} />
        <Route path="/get_transactions" element={!accessToken ? <Loginpage /> :<Home />} />
        <Route path="/login" element={<Loginpage />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
