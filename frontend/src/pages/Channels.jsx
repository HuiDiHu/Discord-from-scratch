import { createContext, useState } from "react"
import Friends from "./channels/Friends"
import DirectMessage from "./channels/DirectMessage"
import Server from "./channels/Server"
import NotFoundPage from "./NotFoundPage"
import ServerSideNavBar from "src/components/channels/ServerSideNavBar"
import UseSocketSetup from "src/components/channels/UseSocketSetup"

export const FriendContext = createContext();
export const MessagesContext = createContext();
export const MemberContext = createContext();
export const ServerContext = createContext();
export const LoadingContext = createContext();

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
    
    //TODO: add pendingList, setPendingList into FriendContext.Provder value
    const [friendList, setFriendList] = useState(null); const [serverList, setServerList] = useState(null); //array of objects
    const [loadedDMs, setLoadedDMs] = useState([]); const [loadedServers, setLoadedServers] = useState([]); const [loadedChannels, setLoadedChannels] = useState([]) //array of ids
    const [messages, setMessages] = useState([]); const [channels, setChannels] = useState([]); //array of objects
    const [memberList, setMemberList] = useState([]); //array of objects (set when new server or dm is being loaded)
    const [usersLoaded, setUsersLoaded] = useState([]); //array of user objects
    const [msgLoading, setMsgLoading] = useState(true); const [sidebarLoading, setSidebarLoading] = useState(true); const [membersLoading, setMembersLoading] = useState(true);
    const [memberListOpen, setMemberListOpen] = useState(true);
    const [sessionTempLinks, setSessionTempLinks] = useState([]);
    UseSocketSetup(setFriendList, setServerList, setMessages, setMemberList, setChannels, setLoadedServers, setUsersLoaded, setSessionTempLinks);
    return (
        <LoadingContext.Provider value={{ msgLoading, setMsgLoading, sidebarLoading, setSidebarLoading, membersLoading, setMembersLoading }} >
            <FriendContext.Provider value={{ friendList, setFriendList }}>
                <ServerContext.Provider value={{ serverList, setServerList, loadedServers, setLoadedServers, loadedChannels, setLoadedChannels, channels, setChannels }} >
                    <MemberContext.Provider value={{ memberList, setMemberList, memberListOpen, setMemberListOpen, sessionTempLinks, setSessionTempLinks }}>
                        <div className="flex h-screen w-screen">
                            <ServerSideNavBar props={{ selectedPath: curPath, setSelectedPath: setCurPath }} />
                            <MessagesContext.Provider value={{ messages, setMessages, loadedDMs, setLoadedDMs, usersLoaded, setUsersLoaded }}>
                                <div className="grow">
                                    {pageView()}
                                </div>
                            </MessagesContext.Provider>
                        </div>
                    </MemberContext.Provider>
                </ServerContext.Provider>
            </FriendContext.Provider>
        </LoadingContext.Provider>
    )
}

export default Channels