import React, { useContext, useLayoutEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendContext, MemberContext, LoadingContext } from 'src/pages/Channels'
import { AccountContext } from 'src/components/auth/UserContext'
import FriendIcon from './friends/FriendIcon'
import { GiUnfriendlyFire } from "react-icons/gi";

const FriendsAndDMSidebar = () => {
    const { friendList } = useContext(FriendContext)
    const { setMemberList } = useContext(MemberContext)
    const { user } = useContext(AccountContext)
    const navigate = useNavigate();
    const { id } = useParams();
    useLayoutEffect(() => {
        if (friendList !== null) {
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
        }
    }, [friendList, id])
    return (
        <div className="flex flex-col min-w-[150px] md:min-w-[200px] lg:min-w-[235px] h-screen bg-[#2a2d31] overflow-y-scroll scrollbar-hide">
            <button
                className={`flex m-2 px-auto py-2 px-5 space-x-2 justify-start items-center ${id === undefined ? 'bg-[#404248]' : 'hover:bg-[#36383c]'} rounded-lg`}
                onClick={() => { navigate('/channels/@me') }}
            >
                <GiUnfriendlyFire className='mr-2 h-6 w-6' />
                <span>Friends</span>
            </button>
            <span className='border' />
            <ul className='flex flex-col px-1 py-3'>
                {friendList !== null && friendList.map((friend) => (
                    <li
                        key={friend.userid}
                        className={`flex items-center pointer-events-auto cursor-pointer p-1 rounded-md ${friend.userid === id ? 'bg-[#404248]' : 'hover:bg-[#36383c]'} transition-all duration-150 ease-in-out`}
                        onClick={() => {
                            if (friend.userid !== id) {
                                navigate(`/channels/@me/${friend.userid}`)
                            }
                        }}
                    >
                        <FriendIcon props={{ friend, selected: friend.userid === id }} />
                    </li>
                ))}
                {friendList === null && (
                    <div className='w-full flex p-3 text-red-800 justify-center'>LOADING...</div>
                )}
            </ul>
        </div>
    )
}

export default FriendsAndDMSidebar