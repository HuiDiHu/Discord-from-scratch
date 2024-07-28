import React from 'react'
import { useNavigate } from 'react-router-dom'

const SideNavItem = ({ props }) => {

    const navigate = useNavigate();
    return (
        <div className="relative flex items-center space-x-2">
            <span
                className={`${props.selectedPath === `/server/${props.server_id}` ? 'h-8' : (props.hoveredPath === `/server/${props.server_id}` ? 'h-4' : 'h-1')} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
            />
            <img
                className={`flex justify-center items-center h-12 w-12 m-auto
                             ${(props.selectedPath === `/server/${props.server_id}` || props.hoveredPath === `/server/${props.server_id}`) ? "rounded-2xl" : "rounded-[50%]"} transition-[border-radius] duration-300 ease-in-out`}
                src={`../../../assets/tempIcons/${props.icon}.png`}
                onMouseOver={() => { props.setHoveredPath(`/server/${props.server_id}`) }}
                onMouseOutCapture={() => { props.setHoveredPath('') }}
                onClick={() => { 
                    props.setSelectedPath(`/server/${props.server_id}`)
                    navigate(`/channels/server/${props.server_id}`)
                }}
            />
        </div>
    )
}

export default SideNavItem