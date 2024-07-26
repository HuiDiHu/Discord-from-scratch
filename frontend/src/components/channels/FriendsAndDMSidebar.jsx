import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendContext } from 'src/pages/Channels'
import { MessagesContext } from 'src/pages/Channels'
import FriendIcon from './friends/FriendIcon'

const FriendsAndDMSidebar = () => {
    const { friendList } = useContext(FriendContext)
    const { setMessages, loadedDMs, setLoadedDMs } = useContext(MessagesContext)
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        if (!id || friendList.length === 0) return;
        const channelId = (friendList.find(item => item.userid === id)).dm_id;
        if (loadedDMs.indexOf(channelId) !== -1) return;
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .get(`/api/v1/messages/channels/@me/${channelId}`)
            .then((res) => {
                setLoadedDMs(prev => [...prev, channelId])
                setMessages(prev => [...res.data, ...prev])
            })
            .catch((error) => {
                console.log(error)
                navigate('/channels/@me')
            })
    }, [friendList, id])
    return (
        <div className="flex flex-col min-w-[150px] md:min-w-[200px] lg:min-w-[235px] h-screen bg-[#2a2d31] overflow-y-scroll scrollbar-hide">
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
                        onClick={() => {
                            navigate(`/channels/@me/${friend.userid}`)
                        }}
                    >
                        <FriendIcon props={{ friend, selected: friend.userid === id }}/>
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