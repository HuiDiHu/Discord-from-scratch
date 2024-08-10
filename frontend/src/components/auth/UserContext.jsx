import axios from "axios";
import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import base64ToURL from "src/base64ToURL";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUser] = useState({ loggedIn: null });

    const navigate = useNavigate();
    useEffect(() => {
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .get('/api/v1/auth/login')
            .then((res) => {
                //I might just have the tism frfr what the fuck am I writing at 4AM
                if (!res || res.status >= 400 || !res.data || !res.data.loggedIn) {
                    setUser({ loggedIn: false })
                } else {
                    //decode base64 string into arraybuffer
                    if (!res.data.profile.startsWith("blob:")) res.data.profile = base64ToURL(res.data.profile);
                
                    setUser({ ...res.data })
                    console.log("logged in", { ...res.data })
                    if (!window.location.pathname.startsWith('/channels')) { navigate('/channels/@me') }
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

export default UserContext;