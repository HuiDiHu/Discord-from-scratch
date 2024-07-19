import { useEffect } from "react"
import Friends from "./channels/Friends"
import DirectMessage from "./channels/DirectMessage"
import Server from "./channels/Server"
import NotFoundPage from "./NotFoundPage"

const Channels = ({ props }) => {
    useEffect(() => {
        
    }, [])
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

export default Channels