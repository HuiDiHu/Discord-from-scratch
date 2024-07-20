import React from 'react'
import { useNavigate } from 'react-router-dom'

const SideNavItem = ({ props }) => {

    const navigate = useNavigate();
    return (
        <div className="relative flex items-center space-x-2">
            <span
                className={`${props.selectedPath === `/server/${props.serverId}` ? 'h-8' : (props.hoveredPath === `/server/${props.serverId}` ? 'h-4' : 'h-1')} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
            />
            <img
                className={`flex justify-center items-center h-12 w-12 m-auto
                             ${(props.selectedPath === `/server/${props.serverId}` || props.hoveredPath === `/server/${props.serverId}`) ? "rounded-2xl" : "rounded-[50%]"} transition-[border-radius] duration-300 ease-in-out`}
                src={`../../../assets/tempIcons/${props.icon}.png`}
                onMouseOver={() => { props.setHoveredPath(`/server/${props.serverId}`) }}
                onMouseOutCapture={() => { props.setHoveredPath('') }}
                onClick={() => { 
                    props.setSelectedPath(`/server/${props.serverId}`)
                    navigate(`/channels/server/${props.serverId}`)
                }}
            />
        </div>
    )
}

export default SideNavItem