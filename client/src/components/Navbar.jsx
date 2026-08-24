import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'




const Navbar = () => {

  const navigate = useNavigate()
  const {userData,backendUrl, setUserData, setIsLoggedin} = useContext(AppContent);
  return (
    <div className='w-full flex justify-between item-center p-3 sm:p-5 sm:px-20 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32 '/>
        <button onClick={()=> navigate('/login')} className='flex items-center gap-2 border boder-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon}/></button>
    </div>
  )
}

export default Navbar