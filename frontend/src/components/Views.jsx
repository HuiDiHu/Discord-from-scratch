import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AccountContext } from './auth/AccountContext';
import PrivateRoutes from 'src/components/auth/PrivateRoutes';
import Login from 'src/pages/Login';
import Signup from 'src/pages/Signup';
import Friends from 'src/pages/Friends';

const Views = () => {
    const { user } = useContext(AccountContext);
    return user.loggedIn === null ? (<h1>Loading...</h1>) : (
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route element={<PrivateRoutes />}>
                <Route path='/friends' element={<Friends />} />
            </Route>
        </Routes>
    )
}

export default Views