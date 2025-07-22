import React, { useEffect, useState } from 'react';  
import { useAuthValue } from './AuthContext';  
import { useHistory } from 'react-router-dom';  
import { auth } from '../firebase';  
import { sendEmailVerification } from 'firebase/auth';  

function VerifyEmail() {  
    const { currentUser } = useAuthValue();  
    const history = useHistory();  
    const [time, setTime] = useState(60);  
    const [timeActive, setTimeActive] = useState(false);  

    useEffect(() => {  
        const interval = setInterval(() => {  
            if (timeActive && time > 0) {  
                setTime((prev) => prev - 1);  
            } else if (time === 0) {  
                setTimeActive(false);  
                setTime(60);  
                clearInterval(interval);  
            }  
        }, 1000);  
        return () => clearInterval(interval);  
    }, [timeActive, time]);  

    const resendEmailVerification = async () => {  
        await sendEmailVerification(auth.currentUser);  
        setTimeActive(true);  
    };  

    useEffect(() => {  
        const interval = setInterval(() => {  
            currentUser?.reload().then(() => {  
                if (currentUser?.emailVerified) {  
                    clearInterval(interval);  
                    history.push('/');  
                }  
            }).catch((err) => alert(err.message));  
        }, 1000);  
        return () => clearInterval(interval);  
    }, [history, currentUser]);  

    return (  
        <div>  
            <p>A verification email has been sent to: <span>{currentUser?.email}</span></p>  
            <button onClick={resendEmailVerification} disabled={timeActive}>Resend Email {timeActive && time}</button>  
            
        </div>  
    );  
}  

export default VerifyEmail;