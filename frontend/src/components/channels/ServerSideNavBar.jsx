import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SideNavItem from "src/components/channels/SideNavItem"
import AddServerModal from 'src/components/channels/AddServerModal';
import logo from "assets/Dlogo.png"
import { GoPlus } from "react-icons/go";
import { ServerContext } from 'src/pages/Channels';



const ServerSideNavBar = ({ props }) => {
    const { serverList } = useContext(ServerContext)
    const [isAddServerOpen, setIsAddServerOpen] = useState(false)
    const navigate = useNavigate();
    return (
        <div className="relative min-w-fit flex flex-col overflow-y-scroll py-5 pr-2 space-y-2 items-center scrollbar-hide">
            <div className="group/home flex items-center space-x-2">
                <span
                    className={`${props.selectedPath.startsWith('/@me') ? 'h-8' : 'h-1 group-hover/home:h-4'} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
                />
                <div
                    className={`flex justify-center items-center h-12 w-12
                             ${props.selectedPath.startsWith('/@me') ? "rounded-2xl bg-[#313167]" : "rounded-[50%] bg-[#31313c]"} group-hover/home:rounded-2xl group-hover/home:bg-[#313167] transition-all duration-300 ease-in-out`}
                    onClick={() => {
                        props.setSelectedPath('/@me')
                        navigate('/channels/@me')
                    }}
                >
                    <img
                        src={logo}
                        className="h-8 w-8"
                    />
                </div>
            </div>
            <div className="w-full flex justify-end pr-2"><span className="border w-8"></span></div>
            {serverList !== null && serverList.map(item => (
                <SideNavItem key={`sv:${item.server_id}`} props={{
                    selectedPath: props.selectedPath, setSelectedPath: props.setSelectedPath,
                    server_id: item.server_id,
                    icon: item.server_icon || 'GRAGAS',
                    server_name: item.server_name
                }}
                />
            ))}
            <div className="group/add flex items-center space-x-2">
                <span
                    className={`${isAddServerOpen ? 'h-8 border-white' : 'group-hover/add:h-4 group-hover/add:border-white h-1 border-transparent'} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
                />
                <div
                    className={`flex justify-center items-center h-12 w-12
                             ${isAddServerOpen ? "rounded-2xl bg-green-500" : "group-hover/add:rounded-2xl group-hover/add:bg-green-500 rounded-[50%] bg-[#31313c]"} transition-all duration-300 ease-in-out`}
                    onClick={() => { setIsAddServerOpen(true) }}
                >
                    <GoPlus className={`h-8 w-8 ${isAddServerOpen ? "text-white" : "group-hover/add:text-white text-green-500"}`} />
                </div>
            </div>

            { isAddServerOpen && <AddServerModal props={{ setIsAddServerOpen, setSelectedPath: props.setSelectedPath }}/> }

        </div>
    )
}

export default ServerSideNavBar