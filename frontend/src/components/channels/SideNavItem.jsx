import { set } from 'date-fns';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoadingContext } from 'src/pages/Channels';

const SideNavItem = ({ props }) => {
    const { setMsgLoading, setSidebarLoading } = useContext(LoadingContext)
    const navigate = useNavigate();
    return (
        <div className="group relative flex items-center space-x-2 cursor-pointer">
            <span
                className={`${props.selectedPath === `/server/${props.server_id}` ? 'h-8' : 'h-1 group-hover:h-4'} 
                                    border-2 rounded-tr-xl rounded-br-xl transition-all ease-in-out duration-300`}
            />
            <img
                className={`flex justify-center items-center h-12 w-12 m-auto
                             ${props.selectedPath === `/server/${props.server_id}` ? "rounded-2xl" : "rounded-[50%]"} group-hover:rounded-2xl transition-[border-radius] duration-300 ease-in-out`}
                src={`../../../assets/tempIcons/${props.icon}.png`}
                onClick={() => {
                    if (props.selectedPath !== `/server/${props.server_id}`) {
                        props.setSelectedPath(`/server/${props.server_id}`);
                        setMsgLoading(true); setSidebarLoading(true);
                        navigate(`/channels/server/${props.server_id}`)
                    }
                }}
            />
            <div className='hidden group-hover:block fixed left-16 max-w-44 max-h-16 z-10 rounded-lg bg-black py-2 px-4'>
                <p className='text-ellipsis overflow-hidden text-md'>{props.server_name}</p>
            </div>
        </div>
    )
}

export default SideNavItem