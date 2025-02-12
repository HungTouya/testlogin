// src/AuthContext.js  
import React, { createContext, useContext, useState } from 'react';  

const AuthContext = createContext();  

export function AuthProvider({ children }) {  
    const [currentUser, setCurrentUser] = useState(null);  
    const [timeActive, setTimeActive] = useState(false);  

    return (  
        <AuthContext.Provider value={{ currentUser, setCurrentUser, timeActive, setTimeActive }}>  
            {children}  
        </AuthContext.Provider>  
    );  
}  

export function useAuthValue() {  
    return useContext(AuthContext);  
}