// src/Register.js  
import React, { useState } from 'react';  
import { auth } from './firebase';  
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';  
import { useHistory, Link } from 'react-router-dom';  
import { useAuthValue } from './AuthContext';  
import './style.css';  

function Register() {  
    const [email, setEmail] = useState('');  
    const [password, setPassword] = useState('');  
    const [confirmPassword, setConfirmPassword] = useState('');  
    const [error, setError] = useState('');  
    const history = useHistory();  
    const { setTimeActive } = useAuthValue();  

    const validatePassword = () => {  
        if (password === '' || confirmPassword === '') {  
            setError('Passwords cannot be empty');  
            return false;  
        }  
        if (password !== confirmPassword) {  
            setError('Passwords do not match');  
            return false;  
        }  
        return true;  
    };  

    const register = async (e) => {  
        e.preventDefault();  
        setError('');  
        if (validatePassword()) {  
            try {  
                const res = await createUserWithEmailAndPassword(auth, email, password);  
                await sendEmailVerification(res.user);  
                setTimeActive(true);  
                history.push('/verify-email');  
            } catch (err) {  
                setError(err.message);  
            }  
        }  
        setEmail('');  
        setPassword('');  
        setConfirmPassword('');  
    };  

    return (  
        <div className="form-container">  
            <h2>Register</h2>  
            <form onSubmit={register} name='registration_form'>  
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />  
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />  
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required />  
                <button type="submit">Register</button>  
                {error && <p className="error">{error}</p>}  
                <Link to="/login">Already have an account? Login</Link>  
            </form>  
        </div>  
    );  
}  

export default Register;