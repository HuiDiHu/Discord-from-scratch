import { GiEntryDoor } from "react-icons/gi";
import axios from "axios";
import { AccountContext } from 'src/components/auth/UserContext'
import { useContext } from "react";
import { SocketContext } from "src/pages/Channels";

const LeaveServer = ({ server_id, setServerOptionsOpen }) => {
    const { user } = useContext(AccountContext)
    const { socket } = useContext(SocketContext)

    const handleLeaveServer = () => {
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .put(`/api/v1/servers/leave/${server_id}`)
            .then((res) => {
                //send socket request to other members
                setServerOptionsOpen(false);
                const { server_members, ...targetServer } = res.data.server;
                socket.emit("left_server", user, targetServer);
            })
            .catch((error) => {
                console.log(error)
                setServerOptionsOpen(false);
            })
    }
    return (
        <div
            className='group/leave flex items-center justify-between px-2 py-1.5 w-[92%] mx-auto rounded-sm hover:bg-red-600 cursor-pointer'
            onClick={handleLeaveServer}
        >
            <span className='text-sm text-red-600 group-hover/leave:text-white'>Leave Server</span>
            <GiEntryDoor
                className='h-[18px] w-[18px] text-red-600 group-hover/leave:text-white'
            />
        </div>
    )
}

export default LeaveServer