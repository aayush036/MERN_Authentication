import { createContext,useState,useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider  = (props)=>{
    axios.defaults.withCredentials=true;
    const backendUrl = 'http://localhost:4000';
    const [isLoggedin,setIsLoggedin] = useState(false);
    const [userData,setUserData] = useState(false);

    const getAuthState = async()=>{
        try {
             const {data} = await axios.get(backendUrl+'/api/auth/is-auth',{withCredentials:true});
             if(data.success){
                setIsLoggedin(true);
                getUserData();
             }
        }catch(error){
            toast.error(data.message);
        }
    }
    const getUserData  = async()=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/user/get-user')
            data.success?setUserData(data.userData):toast.error(data.message);
        }
        catch(error){
            toast.error(data.message);
        }
    }
    const value = {
     backendUrl
    }
    return (  
        <AppContent.Provider value={value}>
      {props.children}
        </AppContent.Provider>
    )
}