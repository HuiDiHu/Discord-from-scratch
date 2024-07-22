import React from 'react'

const FriendIcon = ({ props }) => {
    return (
        <>
            <div className='relative h-9 w-9'>
                <img
                    src={`../../../../assets/tempIcons/${props.friend.profile}.png`}
                    className='h-full w-full rounded-full'
                >
                </img>
                <div
                    className={`absolute h-3 w-3 rounded-lg border-2 border-[#2a2d31] ${props.friend.connected ? "bg-green-500" : "bg-red-500"} bottom-0 right-0`}
                />
            </div>
            <span className='text-neutral-400 text-md ml-2'>{props.friend.username}</span>
        </>
    )
}

export default FriendIcon