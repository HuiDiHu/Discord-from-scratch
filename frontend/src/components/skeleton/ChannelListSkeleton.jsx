import React from 'react'
import { IoChevronDown } from "react-icons/io5";
import TinyUserProfileContainer from 'src/components/TinyUserProfileContainer';

const numChannelSkeleton = 13;

const ChannelListSkeleton = () => {
    return (
        <div className='relative flex flex-shrink-0 flex-col w-[150px] md:w-[200px] lg:w-[235px] h-screen bg-[#2a2d31]'>
            <div className='flex justify-between items-center w-full py-[11.5px] px-4 border-b border-black'>
                <div className='w-[80%] h-6 rounded-lg bg-neutral-600 animate-pulse' />
                <IoChevronDown className='h-5 w-5 cursor-pointer text-white' />
            </div>
            <div className='relative flex flex-col w-full h-[90%] overflow-y-auto scrollbar-hide pb-10'>
                <br />
                <div className='flex items-center justify-between text-sm text-neutral-400 mx-3 my-1'>
                    <span>Channels:</span>
                    <span className='relative text-xl hover:text-white cursor-pointer'>
                        +
                    </span>
                </div>
                {Array.from({ length: numChannelSkeleton }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex items-center w-[90%] mx-auto hover:bg-[#36383c] p-2 rounded-lg cursor-pointer mb-1.5`}
                    >
                        <div className='h-7 w-7 mr-2.5 rounded-full bg-neutral-700 animate-pulse' />
                        <div className='h-5 w-32 bg-neutral-700 animate-pulse rounded-md' />
                    </div>
                ))}
            </div>
            <TinyUserProfileContainer />
        </div>
    )
}

export default ChannelListSkeleton