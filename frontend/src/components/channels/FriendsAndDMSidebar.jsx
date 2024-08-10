import React, { useContext, useLayoutEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FriendContext } from 'src/pages/Channels'
import FriendIcon from './friends/FriendIcon'
import { GiUnfriendlyFire } from "react-icons/gi";
import FriendListSkeleton from '../skeleton/FriendListSkeleton'
import TinyUserProfileContainer from '../TinyUserProfileContainer'

const FriendsAndDMSidebar = () => {
    const { friendList } = useContext(FriendContext)
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="relative flex flex-col w-[150px] md:w-[200px] lg:w-[235px] h-screen bg-[#2a2d31] overflow-y-auto scrollbar-hide flex-shrink-0">
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
                    <FriendListSkeleton />
                )}
            </ul>
            <br /> <br /> <br />
            <TinyUserProfileContainer />
        </div>
    )
}

export default FriendsAndDMSidebar