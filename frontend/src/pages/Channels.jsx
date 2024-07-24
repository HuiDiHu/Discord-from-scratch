import { createContext, useEffect, useState } from "react"
import Friends from "./channels/Friends"
import DirectMessage from "./channels/DirectMessage"
import Server from "./channels/Server"
import NotFoundPage from "./NotFoundPage"
import ServerSideNavBar from "src/components/channels/ServerSideNavBar"
import UseSocketSetup from "src/components/channels/UseSocketSetup"

export const FriendContext = createContext();
export const MessagesContext = createContext();

const Channels = ({ props }) => {
    const path = window.location.pathname.substring(9);
    const [curPath, setCurPath] = useState(path)
    const pageView = () => {
        switch (props.page) {
            case "friends":
                return (<Friends />)
            case "dm":
                return (<DirectMessage />)
            case "server":
                return (<Server />)
            default:
                return (<NotFoundPage />)
        }
    }
    useEffect(() => {

    }, [])
    //TODO: add pendingList, setPendingList into FriendContext.Provder value
    const [friendList, setFriendList] = useState([])
    const [messages, setMessages] = useState([])
    UseSocketSetup(setFriendList, setMessages);

    return (
        <FriendContext.Provider value={{ friendList, setFriendList }}>
            <div className="flex h-screen w-screen">
                <ServerSideNavBar props={{ selectedPath: curPath, setSelectedPath: setCurPath }} />
                <MessagesContext.Provider value={{ messages, setMessages }}>
                    <div className="grow">
                        {pageView()}
                    </div>
                </MessagesContext.Provider>
            </div>
        </FriendContext.Provider>
    )
}

export default Channels