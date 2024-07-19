import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AccountContext } from "./AccountContext";

const useAuth = () => {
    const { user } = useContext(AccountContext)
    return user && user.loggedIn
}

const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoutes