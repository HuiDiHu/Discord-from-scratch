import { useContext, useEffect } from 'react'
import socket from 'src/socket'
import { AccountContext } from 'src/components/auth/UserContext';
import { useNavigate } from 'react-router-dom';

const UseSocketSetup = (setFriendList, setServerList, setMessages, setMemberList, setChannels, setLoadedServers) => {
    const { user, setUser } = useContext(AccountContext);

    const navigate = useNavigate();
    useEffect(() => {
        //maybe make loading then make initialize send a callback for loading
        socket.connect();
        //TODO: socket.on("servers", (serverList) => {})
        socket.on("friends", (friendList) => {
            if (friendList === null || friendList === undefined) {
                console.log("NULL friendlist")
                setFriendList([]);
                return;
            }
            setFriendList(friendList.sort((a, b) => {
                if (a.connected === b.connected) return 0;
                if (a.connected) return -1;
                return 1;
            }))
        });
        socket.on("servers", (serverList) => {
            setServerList(serverList)
        });
        socket.on("create_message", (message) => {
            //TODO: Figure out why sometimes dupe messages get sent and remove this stupid contraption after its fixed
            setMessages(prev => {
                if (!prev.find(item => item.message_id === message.message_id)) {
                    return [...prev, message];
                } else {
                    return [...prev];
                }
            })
        });
        socket.on("delete_message", (message_id, in_dm, in_channel) => {
            setMessages(prev => prev.filter(item => !(item.message_id === message_id && ((in_dm !== null && in_dm !== undefined && item.in_dm === in_dm) || (in_channel !== null && in_channel !== undefined && item.in_channel === in_channel)))))
        });
        socket.on("edit_message", (newMessage, index) => {
            setMessages(prev => prev.with(index, newMessage))
        });
        socket.on("created_channel", (server_id, channel) => {
            setLoadedServers(prev => {
                if (prev.find(item => item === server_id)) {
                    setChannels(prev => [...prev, channel])
                }
                return prev;
            })
        });
        socket.on("joined_server", (targetUser, server) => {
            if (targetUser.userid === user.userid) {
                setServerList(prev => [...prev, server]);
                navigate(`/channels/server/${server.server_id}`)
            } else {
                console.log("NEW MEMBER JOINED!", targetUser);
                setLoadedServers(prev => {
                    if (prev.length > 0 && prev[0] === server.server_id) {
                        setMemberList(prev => [...prev, targetUser]);
                    }
                    return prev;
                })
            }
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
                    return a.connected ? -1 : 1;
                })
            )
            setMemberList(prev =>
                prev.map((member) => {
                    if (member.userid === userid) {
                        member.connected = connected;
                    }
                    return member
                }).sort((a, b) => {
                    if (a.connected === b.connected) return 0;
                    return a.connected ? -1 : 1;
                })
            )
        });
        socket.on("connect_error", () => {
            console.log("Websocket connection error... Logging user out")
            setUser({ loggedIn: false })
        });
        return () => {
            console.log("Closing Sockets...")
            socket.off("friends");
            socket.off("servers");
            socket.off("create_message");
            socket.off("delete_message");
            socket.off("edit_message");
            socket.off("created_channel");
            socket.off("joined_server");
            socket.off("connected");
            socket.off("connect_error");
        };
    }, [])
};

export default UseSocketSetup