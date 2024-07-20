import { useEffect, useState } from "react"
import Friends from "./channels/Friends"
import DirectMessage from "./channels/DirectMessage"
import Server from "./channels/Server"
import NotFoundPage from "./NotFoundPage"
import ServerSideNavBar from "src/components/channels/ServerSideNavBar"

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

    return (
        <div className="flex h-screen w-screen">
            <ServerSideNavBar props={{ selectedPath: curPath, setSelectedPath: setCurPath }}/>
            <div className="flex flex-col w-[250px] h-screen bg-[#31313c]">
                Stuff
            </div>
            <div
                className="flex flex-col grow"
            >
                {pageView()}
            </div>
        </div>
    )
}

export default Channels