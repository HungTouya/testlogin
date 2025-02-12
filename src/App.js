// src/App.js  
import React, { useState, useEffect } from 'react';  
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';  
import { AuthProvider } from './AuthContext';  
import { auth } from './firebase';  
import { onAuthStateChanged } from 'firebase/auth';  
import Register from './Register';  
import Login from './Login';  
import VerifyEmail from './VerifyEmail';  
import Profile from './Profile';  
import PrivateRoute from './PrivateRoute';  

function App() {  
    const [currentUser, setCurrentUser] = useState(null);  
    const [timeActive, setTimeActive] = useState(false);  

    useEffect(() => {  
        const unsubscribe = onAuthStateChanged(auth, (user) => {  
            setCurrentUser(user);  
        });  
        return unsubscribe;  
    }, []);  

    return (  
        <AuthProvider value={{ currentUser, setCurrentUser, timeActive, setTimeActive }}>  
            <Router>  
                <Switch>  
                    <Route path="/register" component={Register} />  
                    <Route path="/login" component={Login} />  
                    <Route path="/verify-email" component={VerifyEmail} />  
                    <PrivateRoute exact path="/profile" component={Profile} />  
                </Switch>  
            </Router>  
        </AuthProvider>  
    );  
}  

export default App;
