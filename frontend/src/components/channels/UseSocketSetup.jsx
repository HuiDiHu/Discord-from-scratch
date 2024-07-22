import { useContext, useEffect } from 'react'
import socket from 'src/socket'
import { AccountContext } from 'src/components/auth/UserContext';

const UseSocketSetup = (setFriendList) => {
    const { setUser } = useContext(AccountContext)
    useEffect(() => {
        socket.connect().emit("initialize");
        socket.on("friends", (friendList) => {
            setFriendList(friendList.map((item) => (JSON.parse(item))))
        });
        socket.on("connect_error", () => {
            console.log("Websocket connection error... Logging user out")
            setUser({ loggedIn: false })
        });
        return () => {
            socket.off("connect_error");
        };
    }, [])
};

export default UseSocketSetup