import React, { useContext } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'




const Navbar = () => {

  const navigate = useNavigate()
  const {userData,backendUrl, setUserData, setIsLoggedin} = useContext(AppContent);
  const logout = async()=>{
    try{
        axios.defaults.withCredentials = true;
        const {data} = await axios.post(backendUrl+'/api/auth/logout');
        data.success && setIsLoggedin(false);
        data.success && setUserData(false);
        navigate('/')
    }catch(error){
       toast.error(error.message);
    }
  }
  const sendVerificationOtp = async()=>{
    try{
        axios.defaults.withCredentials  = true;
        const {data} = await axios.post(backendUrl+'/api/auth/send-verify-otp');
        if(data.success){
          navigate('/email-verify');
          toast.success(data.message);
        }else{
           toast.error(data.message)
        }
    }catch(error){
        toast.error(error.message)
    }
  }
  

  return (
    <div className='w-full flex justify-between item-center p-3 sm:p-5 sm:px-20 absolute top-0'>
        <img src={assets.logo} alt="" className='w-28 sm:w-32 '/>
        {userData?
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded padding pt-10'>
            <ul className='flex flex-col items-center justify-center  list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isAccountVerified &&<li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap'>
                Verify Email 
              </li>}
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10 whitespace-nowrap'>Log out</li>
            </ul>
          </div>

        </div>
      : <button onClick={()=> navigate('/login')} className='flex items-center gap-2 border boder-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon}/></button>} 
    </div>
  )
}

export default Navbar