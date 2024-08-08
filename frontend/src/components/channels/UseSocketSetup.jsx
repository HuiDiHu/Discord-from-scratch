import { useContext, useEffect } from 'react'
import socket from 'src/socket'
import { AccountContext } from 'src/components/auth/UserContext';
import { useNavigate } from 'react-router-dom';

const UseSocketSetup = (setFriendList, setServerList, setMessages, setMemberList, setChannels, setLoadedServers, setUsersLoaded, setSessionTempLinks) => {
    const { user, setUser } = useContext(AccountContext);

    const navigate = useNavigate();

    const disconnectedAll = () => {
        console.log("Closing Sockets...")
        socket.off("friends");
        socket.off("servers");
        socket.off("create_message");
        socket.off("delete_message");
        socket.off("edit_message");
        socket.off("created_channel");
        socket.off("joined_server");
        socket.off("left_server");
        socket.off("update_server_icon")
        socket.off("delete_server")
        socket.off("connected");
        socket.off("connect_error");
        socket.disconnect();
    }

    useEffect(() => {
        //maybe make loading then make initialize send a callback for loading
        if (socket.connected) disconnectedAll();
        socket.connect();
        socket.on("disconnect", () => {
            console.log("disconnecting")
            setSessionTempLinks(prev => {
                prev.forEach(url => {
                    URL.revokeObjectURL(url);
                })
                return [];
            })
        })
        socket.on("friends", (friendList) => {
            console.log("RECIEVED!")
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
            const tempBlobURLs = []
            setServerList(serverList.map(item => {
                if (item.server_icon) {
                    const tempBlobURL = URL.createObjectURL(new Blob([item.server_icon], { type: 'image/png' }));
                    item.server_icon = tempBlobURL;
                    tempBlobURLs.push(tempBlobURL);
                }
                return item;
            }));
            setSessionTempLinks(prev => [...tempBlobURLs, ...prev]);
        });
        socket.on("create_message", (message, author) => {
            //TODO: Figure out why sometimes dupe messages get sent and remove this stupid contraption after its fixed
            setMessages(prev => {
                if (!prev.find(item => item.message_id === message.message_id)) {
                    return [...prev, message];
                } else {
                    return [...prev];
                }
            })
            setUsersLoaded(prev => {
                if (prev.findIndex(item => item.userid === author.userid) === -1) {
                    return [author, ...prev];
                }
                return prev;
            })
        });
        socket.on("delete_message", (message_id, in_dm, in_channel) => {
            setMessages(prev => prev.filter(item => !(item.message_id === message_id && ((in_dm !== null && in_dm !== undefined && item.in_dm === in_dm) || (in_channel !== null && in_channel !== undefined && item.in_channel === in_channel)))))
        });
        socket.on("edit_message", (newMessage) => {
            if (newMessage.in_dm !== null && newMessage.in_dm !== undefined) {
                setMessages(prev => prev.map(item => {
                    if (item.in_dm === newMessage.in_dm && item.message_id === newMessage.message_id) {
                        item = newMessage;
                    }
                    return item;
                }))
            } else if (newMessage.in_channel !== null && newMessage.in_channel !== undefined) {
                setMessages(prev => prev.map(item => {
                    if (item.in_channel === newMessage.in_channel && item.message_id === newMessage.message_id) {
                        item = newMessage;
                    }
                    return item;
                }))
            }
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
                if (server.server_icon) {
                    console.log("blob:",server.server_icon)
                    const tempBlobURL = URL.createObjectURL(new Blob([server.server_icon], { type: 'image/png' }));
                    server.server_icon = tempBlobURL;
                    setSessionTempLinks(prev => [tempBlobURL, ...prev]);
                }
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
        socket.on("left_server", (targetUser, server) => {
            if (targetUser.userid === user.userid) {
                setServerList(prev => prev.filter(item => item.server_id !== server.server_id))
                navigate('/channels/@me')
            } else {
                setLoadedServers(prev => {
                    if (prev.length > 0 && prev[0] === server.server_id) {
                        setMemberList(prev => prev.filter(item => item.userid !== targetUser.userid));
                    }
                    return prev;
                })
            }
        });
        socket.on("update_server_icon", (server_id, arrayBuffer) => {
            const tempBlobURL = URL.createObjectURL(new Blob([arrayBuffer], { type: 'image/png' }));
            setServerList(temp => temp.map(item => {
                if (item.server_id === server_id) {
                    item.server_icon = tempBlobURL;
                    setSessionTempLinks(prev => [tempBlobURL, ...prev]);
                }
                return item;
            }))
        });
        socket.on("delete_server", (server_id) => {
            setServerList(prev => prev.filter(item => item.server_id !== server_id))
            setLoadedServers(prev => {
                if (prev.length > 0 && prev[0] === server_id) navigate('/channels/@me');
                return prev;
            })
        })
        socket.on("connected", (connected, userid) => {
            if (user.userid === userid) {
                setMemberList(prev => prev.map(item => {
                    if (item.userid === user.userid) item.connected = true;
                    return item;
                }))
                return;
            }
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
            disconnectedAll();
        };
    }, [])
};

export default UseSocketSetup