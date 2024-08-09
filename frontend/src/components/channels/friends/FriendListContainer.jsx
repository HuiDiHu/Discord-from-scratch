import React, { useContext, useState } from 'react'
import { FriendContext, LoadingContext } from 'src/pages/Channels';
import FriendIcon from './FriendIcon';
import { IoMdMore } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import DeleteFriend from './DeleteFriend';
import { FaAngleLeft } from "react-icons/fa6";


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
    const [friendSettingOpen, setFriendSettingOpen] = useState(null);
    const navigate = useNavigate();
    return (
        <div className='flex flex-col transition-all'>
            {friendList !== null &&
                <>
                    <span className='text-xs text-neutral-400 font-medium'>
                        {selectedTitle(props.selectedSection)}{props.selectedSection === "Online" ? friendList.filter(item => item.connected).length : friendList.length}
                    </span>
                    <br />
                    {(props.selectedSection === "Online" ? friendList.filter(item => item.connected) : friendList).map(friend => (
                        <div
                            key={`friend_list:${friend.userid}`}
                            className='group relative flex flex-col w-full py-2 hover:bg-[#383c41] rounded-lg cursor-pointer'
                            onClick={() => {
                                navigate(`/channels/@me/${friend.userid}`)
                            }}
                            onMouseLeave={() => { setFriendSettingOpen(null) }}
                        >
                            <span className='absolute -top-0.5 left-2.5 w-[98%] border-y border-[#383c41]' />
                            <div className='flex justify-between items-center w-full pl-2 pr-3.5'>
                                <div className='flex items-center space-x-2'>
                                    <FriendIcon props={{ friend, selected: true }} />
                                </div>
                                <div
                                    className='flex items-center p-1 rounded-full bg-neutral-800 bg-opacity-50 group-hover:bg-opacity-100 transition-transform ease-in-out duration-300'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFriendSettingOpen(prev => {
                                            if (prev === null) return friend.userid;
                                            return null;
                                        });
                                    }}
                                >
                                    {friendSettingOpen !== friend.userid && <IoMdMore className='w-7 h-7' />}
                                    {friendSettingOpen === friend.userid && 
                                        <>
                                            <DeleteFriend setFriendSettingOpen={setFriendSettingOpen} friend_username={friend.username} friend_id={friend.userid} dm_id={friend.dm_id} />
                                            <FaAngleLeft className='w-6 h-6 ml-2'/>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            }
            {friendList === null && (
                <span className='text-xs text-neutral-400 font-medium'>
                    {selectedTitle(props.selectedSection)}0
                </span>
            )}
        </div>
    )
}

export default FriendListContainer