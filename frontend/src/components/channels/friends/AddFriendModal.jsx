import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";

const AddFriendModal = ({ props }) => {
    const [friendId, setFriendId] = useState("")
    const [friendIdErrMsg, setFriendIdErrMsg] = useState("")

    const handleAddFriend = () => {
        if (!friendId) {
            setFriendIdErrMsg("id cannot be empty!")
            return;
        }
        
        props.setIsAddFriendOpen(false)
        alert("Friend request sent!")
    }

    return (
        <div
            className='h-full w-full overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={() => { props.setIsAddFriendOpen(false) }}
        >
            <div
                className='relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%] h-[300px] bg-[#31313c] rounded-3xl flex flex-col py-5 px-10'
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => { e.key === "Enter" && handleAddFriend() }}
            >
                <span className='text-2xl'>Add a friend!</span>
                <br />
                <br />
                <>
                    <span className='text-sm text-neutral-400 mb-2'>You can add friends with their user id</span>
                    <div className={`border-2 ${friendIdErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2`}>
                        <input
                            className='bg-transparent w-[90%] outline-none'
                            placeholder='Enter an user id ...'
                            value={friendId}
                            onChange={(e) => {
                                setFriendId(e.target.value)
                                if (!e.target.value) {
                                    setFriendIdErrMsg("id cannot be empty!")
                                } else {
                                    setFriendIdErrMsg("")
                                }
                            }}
                        />
                    </div>
                    <div className='h-6 bg-red'>
                        <span className='text-red-600 text-xs ml-1'>{friendIdErrMsg}</span>
                    </div>
                </>
                <button
                    className='absolute bottom-0 right-6 bg-[#203FAF] rounded-xl py-4 mb-5 text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 mt-5 w-28 mx-auto'
                    onClick={handleAddFriend}
                >
                    Continue
                </button>
                <IoMdClose
                    className='absolute top-4 right-4 w-6 h-6 cursor-pointer'
                    onClick={() => { props.setIsAddFriendOpen(false) }}
                />
            </div>
        </div>
    )
}

export default AddFriendModal