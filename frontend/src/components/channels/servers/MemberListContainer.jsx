import React, { useContext } from 'react'
import { MemberContext } from 'src/pages/Channels'
import FriendIcon from '../friends/FriendIcon'

const MemberListContainer = () => {
    const { memberList } = useContext(MemberContext)
    return (
        <div className='flex flex-col h-full w-[225px] bg-[#313167] flex-shrink-0 p-5 pl-3 border-l border-l-neutral-500'>
            <span className='text-neutral-400 text-sm mb-2 whitespace-pre'>{"   "}MEMBERS-{memberList.length}</span>
            <ul className='flex flex-col'>
                {memberList.sort((a, b) => {
                    if (a.connected === b.connected) return 0;
                    return a.connected ? -1 : 1;
                }).map((member) => (
                    <li
                        key={member.userid}
                        className='flex items-center rounded-md cursor-pointer hover:bg-gray-600 px-2 py-1'
                    >
                        <FriendIcon props={{ friend: member }} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default MemberListContainer