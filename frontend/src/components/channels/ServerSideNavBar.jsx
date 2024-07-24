import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SideNavItem from "src/components/channels/SideNavItem"
import logo from "assets/Dlogo.png"
import { GoPlus } from "react-icons/go";

const tempServerIconList = [
    "GRAGAS",
    "RIVEN",
    "LISSANDRA",
    "GAREN",
    "YONE",
    "MALPHITE",
    "YUUMI",
    "VAYNE"
]

const ServerSideNavBar = ({ props }) => {
    const [hoveredPath, setHoveredPath] = useState("")

    const navigate = useNavigate();
    return (
        <div className="min-w-fit flex flex-col overflow-y-scroll py-5 pr-2 space-y-2 items-center">
            <div className="flex items-center space-x-2">
                <span
                    className={`${props.selectedPath.startsWith('/@me') ? 'h-8' : (hoveredPath.startsWith('/@me') ? 'h-4' : 'h-1')} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
                />
                <div
                    className={`flex justify-center items-center h-12 w-12
                             ${(props.selectedPath.startsWith('/@me') || hoveredPath.startsWith('/@me')) ? "rounded-2xl bg-[#313167]" : "rounded-[50%] bg-[#31313c]"} transition-all duration-300 ease-in-out`}
                    onMouseOver={() => { setHoveredPath('/@me') }}
                    onMouseOutCapture={() => { setHoveredPath('') }}
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
            {tempServerIconList.map((item, index) => (
                <SideNavItem key={index} props={{
                    selectedPath: props.selectedPath, setSelectedPath: props.setSelectedPath,
                    hoveredPath, setHoveredPath,
                    serverId: index,
                    icon: item
                }}
                />
            ))}
            <div className="flex items-center space-x-2">
                <span
                    className={`${props.selectedPath.startsWith('/add_server') ? 'h-8' : (hoveredPath.startsWith('/add_server') ? 'h-4' : 'h-1')} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
                />
                <div
                    className={`flex justify-center items-center h-12 w-12
                             ${(props.selectedPath.startsWith('/add_server') || hoveredPath.startsWith('/add_server')) ? "rounded-2xl bg-green-500" : "rounded-[50%] bg-[#31313c]"} transition-all duration-300 ease-in-out`}
                    onMouseOver={() => { setHoveredPath('/add_server') }}
                    onMouseOutCapture={() => { setHoveredPath('') }}
                    onClick={() => {
                        props.setSelectedPath('/add_server')
                    }}
                >
                    <GoPlus className={`h-8 w-8 ${(props.selectedPath.startsWith('/add_server') || hoveredPath.startsWith('/add_server')) ? "text-white" : "text-green-500"}`} />
                </div>
            </div>
        </div>
    )
}

export default ServerSideNavBar