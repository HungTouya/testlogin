// src/PrivateRoute.js  
import { Route, Redirect } from 'react-router-dom';  
import { useAuthValue } from './AuthContext';  

export default function PrivateRoute({ component: Component, ...rest }) {  
    const { currentUser } = useAuthValue();  
    return (  
        <Route {...rest} render={props => (  
            currentUser?.emailVerified ? <Component {...props} /> : <Redirect to='/login' />  
        )} />  
    );  
}