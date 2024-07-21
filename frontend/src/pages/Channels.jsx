import { createContext, useEffect, useState } from "react"
import Friends from "./channels/Friends"
import DirectMessage from "./channels/DirectMessage"
import Server from "./channels/Server"
import NotFoundPage from "./NotFoundPage"
import ServerSideNavBar from "src/components/channels/ServerSideNavBar"

export const FriendContext = createContext();

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

    const [friendList, setFriendList] = useState([
        {
            id: "69",
            username: "Andy",
            profile: "GAREN",
            connected: false
        },
        {
            id: "2",
            username: "Jerry",
            profile: "RIVEN",
            connected: true
        },
        {
            id: "3",
            username: "Brandon",
            profile: "GRAGAS",
            connected: true
        }
    ])

    return (
        <FriendContext.Provider value={{ friendList, setFriendList }}>
            <div className="flex h-screen w-screen">
                <ServerSideNavBar props={{ selectedPath: curPath, setSelectedPath: setCurPath }} />
                <div
                    className="w-auto h-screen"
                >
                    {pageView()}
                </div>
            </div>
        </FriendContext.Provider>
    )
}

export default Channels