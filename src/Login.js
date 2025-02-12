// src/Login.js  
import React, { useState } from 'react';  
import { auth } from './firebase';  
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';  
import { useHistory, Link } from 'react-router-dom';  
import { useAuthValue } from './AuthContext';  
import './style.css';  

function Login() {  
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  
    const history = useHistory();  
    const { setTimeActive } = useAuthValue();  

    const login = async (e) => {  
        e.preventDefault();  
        setError('');  
        try {  
            await signInWithEmailAndPassword(auth, email, password);  
            if (!auth.currentUser.emailVerified) {  
                await sendEmailVerification(auth.currentUser);  
                setTimeActive(true);  
                history.push('/verify-email');  
            } else {  
                history.push('/');  
            }  
        } catch (err) {  
            setError(err.message);  
        }  
    };  

    return (  
        <form onSubmit={login} name='login_form'>  
            <h2>Login</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />  
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />  
            <button type="submit">Login</button>  
            {error && <p>{error}</p>}  
            <Link to="/register">Create new account</Link>  
        </form>  
    );  
}  

export default Login;