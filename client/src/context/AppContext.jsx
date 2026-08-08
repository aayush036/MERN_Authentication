import { createContext,useState,useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider  = (props)=>{
    axios.defaults.withCredentials=true;
    const backendUrl = 'http://localhost:4000';

    const value = {
     backendUrl
    }
    return (  
        <AppContent.Provider value={value}>
      {props.children}
        </AppContent.Provider>
    )
}