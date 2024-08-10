import React, { useContext, useRef, useState } from 'react'
import { AccountContext } from 'src/components/auth/UserContext';
import socket from 'src/socket'
import { BsPlusCircleFill } from "react-icons/bs";
import { HiPaperAirplane } from "react-icons/hi2";


const ChatBox = ({ props }) => {
    const [message, setMessage] = useState("")
    const { user } = useContext(AccountContext)

    const textRef = useRef()
    const handleSubmit = (e) => {
        e.stopPropagation(); e.preventDefault();
        if (!message.length) return;
        //TODO: add message length limit  --- fuck no
        const messageObject = {
            created_at: new Date().getTime(),
            content: message,
            posted_by: user.userid,
            is_edited: 0,
            in_dm: null,
            in_channel: null
        }
        if (props.channelType === 'dm') messageObject.in_dm = props.channelId;
        if (props.channelType === 'channel') messageObject.in_channel = props.channelId;
        socket.emit("create_message", messageObject);
        textRef.current.style.height = '24px'
        setMessage("")
    }
    return (
        <div className='flex w-auto px-3 py-2 bg-[#313167] border-t space-x-4 mx-4 mb-3 rounded-b-lg'>
            <BsPlusCircleFill
                className='h-6 w-6 cursor-pointer text-neutral-300'
                onClick={() => { alert("Upload stuff and shits yn?") }}
            />
            <textarea
                className='h-6 max-h-72 w-[80%] resize-none text-sm bg-transparent outline-none cursor-text mt-0.5'
                placeholder={`Message ${props.channel_name}`}
                autoComplete='off'
                ref={textRef}
                onChange={(e) => {
                    setMessage(e.target.value)
                    textRef.current.style.height = '24px'
                    textRef.current.style.height = `${textRef.current.scrollHeight}px`
                }}
                value={message}
                onKeyDown={(e) => { e.key === "Enter" && handleSubmit(e) }}
            />
            <div className='flex justify-end grow'>
                <button
                    className='flex items-center justify-center w-16 border-l border-neutral-500'
                    onClick={handleSubmit}
                >
                    <HiPaperAirplane className={`${message.length > 0 ? 'text-white' : 'text-neutral-500'} w-10 h-5`} />
                </button>
            </div>
        </div>
    )
}

export default ChatBox