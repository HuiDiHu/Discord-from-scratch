import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendContext } from 'src/pages/Channels'
import FriendIcon from './friends/FriendIcon'

const FriendsAndDMSidebar = () => {
    const { friendList, setFriendList } = useContext(FriendContext)
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="flex flex-col w-[250px] h-screen bg-[#2a2d31] overflow-y-scroll">
            <button 
                className='m-2 px-auto py-2 bg-red-800 flex justify-center items-center'
                onClick={() => {navigate('/channels/@me')}}
            >
                <span>Friends</span>
            </button>
            <span className='border' />
            <ul className='flex flex-col px-1 py-3'>
                {friendList.map((friend) => (
                    <li
                        key={friend.userid}
                        className={`flex items-center pointer-events-auto cursor-pointer p-1 rounded-md ${friend.userid === id ? 'bg-[#404248]' : 'hover:bg-[#36383c]'} transition-all duration-150 ease-in-out`}
                        onClick={() => {navigate(`/channels/@me/${friend.userid}`)}}
                    >
                        <FriendIcon props={{ friend }}/>
                    </li>
                ))}
                {friendList.length === 0 && (
                    <div className='w-full flex p-3 justify-center'>Insert loading state here...</div>
                )}
            </ul>
        </div>
    )
}

export default FriendsAndDMSidebar