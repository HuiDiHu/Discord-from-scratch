import { Routes, Route } from 'react-router-dom';
import { useContext } from 'react';
import { AccountContext } from './auth/UserContext';
import PrivateRoutes from 'src/components/auth/PrivateRoutes';
import Login from 'src/pages/Login';
import Signup from 'src/pages/Signup';
import Channels from 'src/pages/Channels';
import NotFoundPage from 'src/pages/NotFoundPage';

const Views = () => {
    const { user } = useContext(AccountContext);
    return user.loggedIn === null ? (<div className='h-screen w-screen bg-neutral-600'><h1>Loading..............</h1></div>) : (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route element={<PrivateRoutes />}>
                <Route path='/channels/@me' element={<Channels props={{ page: "friends" }} />} />
                <Route path='/channels/@me/:id' element={<Channels props={{ page: "dm" }} />} />
                <Route path='/channels/server/:id' element={<Channels props={{ page: "server" }} />} />
            </Route>
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    )
}

export default Views