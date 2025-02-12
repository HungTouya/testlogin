// src/Profile.js  
import React from 'react';  
import { useAuthValue } from './AuthContext';  
import { signOut } from 'firebase/auth';  
import { auth } from './firebase';  

function Profile() {  
    const { currentUser } = useAuthValue();  

    return (  
        <div>  
            <h1>Profile</h1>  
            <p><strong>Email: </strong>{currentUser?.email}</p>  
            <p><strong>Email verified: </strong>{`${currentUser?.emailVerified}`}</p>  
            <span onClick={() => signOut(auth)}>Sign Out</span>  
        </div>  
    );  
}  

export default Profile;