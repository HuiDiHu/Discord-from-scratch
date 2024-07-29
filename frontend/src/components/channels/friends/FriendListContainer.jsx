import React, { useContext } from 'react'
import { FriendContext, LoadingContext } from 'src/pages/Channels';
import FriendIcon from './FriendIcon';
import { IoMdMore } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const selectedTitle = (selectedSection) => {
    switch (selectedSection) {
        case "All":
            return "ALL FRIENDS - ";
        case "Online":
            return "ONLINE - ";
        default:
            return "UNDEFINED - ";
    }
}

const FriendListContainer = ({ props }) => {
    const { friendList } = useContext(FriendContext)
    const { setMsgLoading } = useContext(LoadingContext)
    const navigate = useNavigate();
    return (
        <div className='flex flex-col transition-all'>
            <span className='text-xs text-neutral-400 font-medium'>
                {selectedTitle(props.selectedSection)}{props.selectedSection === "Online" ? friendList.filter(item => item.connected).length : friendList.length}
            </span>
            <br />
            {(props.selectedSection === "Online" ? friendList.filter(item => item.connected) : friendList).map(friend => (
                <div
                    key={`friend_list:${friend.userid}`}
                    className='group relative flex flex-col w-full py-2 hover:bg-[#383c41] rounded-lg cursor-pointer'
                    onClick={() => {
                        setMsgLoading(true)
                        navigate(`/channels/@me/${friend.userid}`)
                    }}
                >
                    <span className='absolute -top-0.5 left-2.5 w-[98%] border-y border-[#383c41]' />
                    <div className='flex justify-between items-center w-full pl-2 pr-3.5'>
                        <div className='flex items-center space-x-2'>
                            <FriendIcon props={{ friend, selected: true }} />
                        </div>
                        <div 
                            className='p-1 rounded-full bg-neutral-800 bg-opacity-50 group-hover:bg-opacity-100'
                            onClick={(e) => {
                                e.stopPropagation();
                                alert('REMOVE FRIEND, ... (more features will be added)')
                            }}
                        >
                            <IoMdMore className='w-7 h-7'/>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default FriendListContainer