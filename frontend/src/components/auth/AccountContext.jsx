import axios from "axios";
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({ loggedIn: null });

    const navigate = useNavigate();
    useEffect(() => {
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? 'http://localhost:4000' : '',
                withCredentials: true
            })
            .get('/api/v1/auth/login')
            .then((res) => {
                //I might just have the tism frfr what the fuck am I writing at 4AM
                if (!res || res.status >= 400 || !res.data) {
                    setUser({ loggedIn: false })
                } else {
                    setUser({ ...res.data })
                    console.log("logged in", { ...res.data })
                }
            })
            .catch((error) => {
                setUser({ loggedIn: false })
            })
    }, [])

    return (
        <AccountContext.Provider value={{ user, setUser }}>
            {children}
        </AccountContext.Provider>
    )
}

export default UserContext