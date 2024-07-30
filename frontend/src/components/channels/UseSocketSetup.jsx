import { useContext, useEffect } from 'react'
import socket from 'src/socket'
import { AccountContext } from 'src/components/auth/UserContext';

const UseSocketSetup = (setFriendList, setServerList, setMessages, setMemberList, setSidebarLoading) => {
    const { setUser } = useContext(AccountContext)
    useEffect(() => {
        setSidebarLoading(true)
        //maybe make loading then make initialize send a callback for loading
        socket.connect();
        //TODO: socket.on("servers", (serverList) => {})
        socket.on("friends", (friendList) => {
            setFriendList(friendList.sort((a, b) => {
                if (a.connected === b.connected) return 0;
                if (a.connected) return -1;
                return 1;
            }))
            setSidebarLoading(false)
        });
        socket.on("servers", (serverList) => {
            setServerList(serverList)
        })
        //TODO: set up messages socket
        socket.on("create_message", (message) => {
            //console.log(message)
            setMessages(prev => [...prev, message])
        });
        socket.on("delete_message", (message_id, in_dm, in_channel) => {
            setMessages(prev => prev.filter(item => !( item.message_id === message_id && ( (in_dm !== null && item.in_dm === in_dm) || (in_channel !== null && item.in_channel === in_channel) ) )))
        })
        socket.on("edit_message", (newMessage, index) => {
            setMessages(prev => prev.with(index, newMessage))
        })
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
            setMemberList(prev => prev.map(member => {
                if (member.userid === userid) {
                    member.connected = connected;
                }
                return member
            }))
        });
        socket.on("connect_error", () => {
            console.log("Websocket connection error... Logging user out")
            setUser({ loggedIn: false })
        });
        return () => {
            socket.off("friends");
            socket.off("servers");
            socket.off("create_message");
            socket.off("delete_message");
            socket.off("edit_message");
            socket.off("connected");
            socket.off("connect_error");
        };
    }, [])
};

export default UseSocketSetup