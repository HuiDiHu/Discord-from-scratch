import React from 'react'

const numFriendSkeleton = 15;

const FriendListSkeleton = () => {
    return (
        <>
            {Array.from({ length: numFriendSkeleton }).map((_, index) => (
                <div 
                    key={index}
                    className={`flex items-center pointer-events-auto cursor-pointer p-1 rounded-md hover:bg-[#36383c] transition-all duration-150 ease-in-out my-1`}
                >
                    <div className='h-10 w-10 rounded-full ml-3 mr-2 cursor-pointer bg-neutral-700 animate-pulse' />
                    <div className={`rounded-lg h-5 w-28 bg-neutral-600 animate-pulse mb-1.5 mt-1`} />
                </div>
            ))}

        </>
    )
}

export default FriendListSkeleton