import React from 'react'

const lengthArray = [6, 10, 12, 16, 20]

const BodyMessageSkeleton = ({ rng, numText }) => {
    return (
        <div className='relative group w-full py-0.5 flex items-start pr-10 pl-[60px] space-x-2 overflow-x-hidden flex-shrink-0'>
            {Array.from({ length: numText }).map((_, index) => (
                <div
                    key={index}
                    className={`rounded-md h-4 w-${lengthArray[Math.floor(rng() * lengthArray.length)]} bg-neutral-700 animate-pulse`}
                />
            ))}
        </div>
    )
}

export default BodyMessageSkeleton