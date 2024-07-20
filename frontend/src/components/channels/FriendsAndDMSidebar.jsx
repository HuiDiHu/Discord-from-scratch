import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendContext } from 'src/pages/Channels'

const FriendsAndDMSidebar = () => {
    const { friendList, setFriendList } = useContext(FriendContext)
    const navigate = useNavigate();
    const { id } = useParams();
    return (
        <div className="flex flex-col w-[250px] h-screen bg-[#2a2d31]">
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
                        key={friend.id}
                        className={`flex items-center pointer-events-auto cursor-pointer p-1 rounded-md ${friend.id === id ? 'bg-[#404248]' : 'hover:bg-[#36383c]'}`}
                        onClick={() => {navigate(`/channels/@me/${friend.id}`)}}
                    >
                        <div className='relative h-9 w-9'>
                            <img
                                src={`../../../assets/tempIcons/${friend.profile}.png`}
                                className='h-full w-full rounded-full'
                            >
                            </img>
                            <div
                                className={`absolute h-3 w-3 rounded-lg border-2 border-[#2a2d31] ${friend.connected ? "bg-green-500" : "bg-red-500"} bottom-0 right-0`}
                            />
                        </div>
                        <span className='text-neutral-400 text-md ml-2'>{friend.username}</span>
                    </li>
                ))}
                {friendList.length === 0 && (
                    <div>No bitches? .XD</div>
                )}
            </ul>
        </div>
    )
}

export default FriendsAndDMSidebar