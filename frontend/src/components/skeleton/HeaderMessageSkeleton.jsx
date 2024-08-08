import React from 'react'

const lengthArray = [6, 10, 12, 16, 20]



const HeaderMessageSkeleton = ({ rng, nameLength, numText }) => {
    //console.log(nameLength)
    return (
        <div className='w-full py-0.5 flex items-start pr-10 mt-4 flex-shrink-0'>
            <div className='h-10 w-10 rounded-full ml-3 mr-2 cursor-pointer bg-neutral-700 animate-pulse flex-shrink-0' />
            <div className='w-full flex flex-col'>
                <div className={`rounded-lg h-5 w-${nameLength} bg-neutral-600 animate-pulse mb-1.5 mt-1`} />
                <div className='flex space-x-2 overflow-x-hidden'>
                    {Array.from({ length: numText }).map((_, index) => (
                        <div
                            key={index}
                            className={`rounded-md h-4 w-${lengthArray[Math.floor(rng() * lengthArray.length)]} bg-neutral-700 animate-pulse`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default HeaderMessageSkeleton