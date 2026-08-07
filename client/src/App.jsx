import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import Home from './pages/Home'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div >
      <ToastContainer/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/> 
      <Route path='/email-verify' element={<EmailVerify/>}/>     
    </Routes>
      
      
      </div>
  )
}

export default App