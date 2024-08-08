import { BsPeopleFill } from "react-icons/bs";
import { BsPlusCircleFill } from "react-icons/bs";
import { HiPaperAirplane } from "react-icons/hi2";
import HeaderMessageSkeleton from "./HeaderMessageSkeleton";
import BodyMessageSkeleton from "./BodyMessageSkeleton";

import seedrandom from 'seedrandom'
import { useLayoutEffect, useState } from "react";


const nameLengthArr = [16, 20, 28]


const ChannelSkeleton = ({ skeletonSeed, channelType }) => {
    const rng = seedrandom(skeletonSeed)

    const genNL = ( st ) => { return nameLengthArr[Math.floor(rng() * nameLengthArr.length)]; }
    const genTL = ( st ) => { return 5 + Math.floor(rng() * 6); }
    return (
        <div className='flex flex-col h-full grow bg-gradient-to-r from-[#303338] to-[#313167]'>
            {/* skeleton of ChannelHeader */}
            <div className='min-h-12 w-auto bg-[#313167ff] border-b border-black my-auto'>
                <div className="h-full flex items-center ml-2">
                    {channelType === 'dm' && <div className='h-10 w-10 rounded-full bg-neutral-700 animate-pulse' />}
                    <div className='h-full flex justify-between items-center mr-5 ml-3 w-full'>
                        <div className="rounded-md h-5 w-20 bg-neutral-700 animate-pulse" />
                        {channelType === 'channel' && <BsPeopleFill className={`h-5 w-5 hover:text-white text-neutral-500 ease-in-out duration-300 cursor-pointer`} />}
                    </div>
                </div>
            </div>
            <div className='flex flex-col h-[calc(100%-3rem)]'>
                {/* skeleton of Chat */}
                <div className='w-full grow flex flex-col justify-end overflow-y-scroll pr-3'>
                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <BodyMessageSkeleton rng={rng} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />

                    <HeaderMessageSkeleton rng={rng} nameLength={genNL()} numText={genTL()} />
                    <br />
                </div>
                {/* skeleton of ChatBox */}
                <div className='flex w-auto px-3 py-2 bg-[#313167] border-t space-x-4 mx-4 mb-3 rounded-b-lg'>
                    <BsPlusCircleFill className='h-6 w-6 cursor-pointer text-neutral-300' />
                    <textarea
                        className='h-6 max-h-72 w-[80%] resize-none text-sm bg-transparent outline-none cursor-text mt-0.5'
                        placeholder={`Message @Skeleton`}
                        readOnly={true}
                    />
                    <div className='flex justify-end grow'>
                        <button
                            className='flex items-center justify-center w-16 border-l border-neutral-500'
                        >
                            <HiPaperAirplane className='text-neutral-500 w-10 h-5' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChannelSkeleton