import { useContext, useEffect } from 'react'
import socket from 'src/socket'
import { AccountContext } from 'src/components/auth/UserContext';

const UseSocketSetup = () => {
    const { setUser } = useContext(AccountContext)
    useEffect(() => {
        socket.connect();
        socket.on("connect_error", () => {
            console.log("Websocket connection error... Logging user out")
            setUser({ loggedIn: false })
        })
        return () => {
            socket.off("connect_error");
        }
    }, [setUser])
};

export default UseSocketSetup