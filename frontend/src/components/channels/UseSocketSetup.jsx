import { useContext, useEffect } from 'react'
import socket from 'src/socket'
import { AccountContext } from 'src/components/auth/UserContext';

const UseSocketSetup = (setFriendList, setMessages) => {
    const { setUser } = useContext(AccountContext)
    useEffect(() => {
        socket.connect();
        socket.on("friends", (friendList) => {
            setFriendList(friendList.sort((a, b) => {
                if (a.connected === b.connected) return 0;
                if (a.connected) return -1;
                return 1;
            }))
        });
        //TODO: set up messages socket
        socket.on("create_message", (message) => {
            setMessages(prev => [...prev, message])
        });
        socket.on("connected", (connected, userid) => {
            setFriendList(prev =>
                prev.map((friend) => {
                    if (friend.userid === userid) {
                        friend.connected = connected
                    }
                    return friend
                }).sort((a, b) => {
                    if (a.connected === b.connected) return 0;
                    if (a.connected) return -1;
                    return 1;
                })
            )
        });
        socket.on("connect_error", () => {
            console.log("Websocket connection error... Logging user out")
            setUser({ loggedIn: false })
        });
        return () => {
            socket.off("initialize");
            socket.off("friends");
            socket.off("create_message");
            socket.off("connected");
            socket.off("connect_error");
        };
    }, [])
};

export default UseSocketSetup