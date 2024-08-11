import React, { useContext, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { FriendContext, MemberContext, SocketContext } from 'src/pages/Channels'
import base64ToURL from 'src/base64ToURL';

const AddFriendModal = ({ props }) => {
    const { setFriendList } = useContext(FriendContext)
    const { setSessionTempLinks } = useContext(MemberContext)
    const { socket } = useContext(SocketContext)
    
    const [friendId, setFriendId] = useState("")
    const [friendIdErrMsg, setFriendIdErrMsg] = useState("")

    const handleAddFriend = () => {
        if (!friendId) {
            setFriendIdErrMsg("id or email cannot be empty!")
            return;
        }
        socket.emit("add_friend", friendId, ({ done,  errMsg, friend }) => {
            if (done) {
                //TODO: set pending list 
                if (friend.profile) {
                    friend.profile = base64ToURL(friend.profile);
                    setSessionTempLinks(prev => [friend.profile, ...prev]);
                }
                setFriendList(prev => [friend, ...prev])
                props.setIsAddFriendOpen(false)
                return;
            }
            setFriendIdErrMsg(errMsg)
        })
    }

    return (
        <div
            className='h-full w-full overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={() => { props.setIsAddFriendOpen(false) }}
        >
            <div
                className='relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%] h-[300px] bg-[#31313c] rounded-3xl flex flex-col py-5 px-10'
                onClick={(e) => e.stopPropagation()}
            >
                <span className='text-2xl'>Add a friend!</span>
                <br />
                <br />
                <>
                    <span className='text-sm text-neutral-400 mb-2'>You can add friends with their user id or email</span>
                    <div className={`border-2 ${friendIdErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2`}>
                        <input
                            className='bg-transparent w-[90%] outline-none'
                            placeholder='Enter an user id or email...'
                            type='text'
                            value={friendId}
                            onChange={(e) => {
                                setFriendId(e.target.value)
                                if (!e.target.value) {
                                    setFriendIdErrMsg("id or email cannot be empty!")
                                } else {
                                    setFriendIdErrMsg("")
                                }
                            }}
                            onKeyDown={(e) => { e.key === "Enter" && handleAddFriend() }}
                        />
                    </div>
                    <div className='h-6'>
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