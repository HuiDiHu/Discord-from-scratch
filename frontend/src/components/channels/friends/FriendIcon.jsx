import React from 'react'

const FriendIcon = ({ props }) => {
    return (
        <>
            <div className='relative h-10 w-10'>
                <img
                    src={`../../../../assets/tempIcons/${props.friend.profile}.png`}
                    className='h-full w-full [clip-path:circle(45%_at_50%_50%)]'
                >
                </img>
                <div
                    className={`absolute h-3 w-3 rounded-lg border-2 border-[#2a2d31] ${props.friend.connected ? "bg-green-500" : "bg-red-500"} transition-all duration-300 ease-in-out bottom-0.5 right-0.5`}
                />
            </div>
            <span className={`${props.selected ? 'text-white' : 'text-neutral-400'} text-md ml-2 truncate`}>{props.friend.username}</span>
        </>
    )
}

export default FriendIcon