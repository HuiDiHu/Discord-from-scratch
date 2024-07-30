import React, { useContext, useLayoutEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendContext, MessagesContext, MemberContext, LoadingContext } from 'src/pages/Channels'
import { AccountContext } from 'src/components/auth/UserContext'
import FriendIcon from './friends/FriendIcon'

const FriendsAndDMSidebar = () => {
    const { msgLoading, setMsgLoading } = useContext(LoadingContext)
    const { friendList } = useContext(FriendContext)
    const { setMessages, loadedDMs, setLoadedDMs } = useContext(MessagesContext)
    { }
    const { setMemberList } = useContext(MemberContext)
    const { user } = useContext(AccountContext)
    const navigate = useNavigate();
    const { id } = useParams();
    useLayoutEffect(() => {
        setMsgLoading(true)
        if (!id || friendList.length === 0) {
            console.log("INVALID ID!")
            return;
        }
        const friend = friendList.find(item => item.userid === id)
        if (!friend) {
            console.log("FRIEND DOESN'T EXIST!")
            return;
        }
        setMemberList([user, friend])
        if (loadedDMs.indexOf(friend.dm_id) !== -1) {
            setMsgLoading(false)
            console.log("DM ALREADY IN FRONTEND CACHE!")
            return;
        }
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .get(`/api/v1/messages/channels/@me/${friend.dm_id}`)
            .then((res) => {
                setLoadedDMs(prev => [...prev, friend.dm_id])
                setMessages(prev => [...res.data, ...prev])
                setMsgLoading(false)
            })
            .catch((error) => {
                console.log(error)
                navigate('/channels/@me')
                setMsgLoading(false)
            })
    }, [friendList, id])
    return (
        <div className="flex flex-col min-w-[150px] md:min-w-[200px] lg:min-w-[235px] h-screen bg-[#2a2d31] overflow-y-scroll scrollbar-hide">
            <button
                className='m-2 px-auto py-2 bg-red-800 flex justify-center items-center'
                onClick={() => { navigate('/channels/@me') }}
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
                            if (friend.userid !== id) {
                                setMsgLoading(true)
                                navigate(`/channels/@me/${friend.userid}`)
                            }
                        }}
                    >
                        <FriendIcon props={{ friend, selected: friend.userid === id }} />
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