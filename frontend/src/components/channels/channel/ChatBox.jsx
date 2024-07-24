import React, { useContext, useRef, useState } from 'react'
import { AccountContext } from 'src/components/auth/UserContext';
import socket from 'src/socket'
import { MessagesContext } from 'src/pages/Channels';

const ChatBox = ({ props }) => {
    const [message, setMessage] = useState("")
    const { user } = useContext(AccountContext)
    const { setMessages } = useContext(MessagesContext)

    const textRef = useRef()
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.length) return;
        //TODO: add message length limit
        const messageObject = {
            from: {
                user: user.userid,
                channel: props.channelId 
            },
            content: message,
            createdAt: new Date().toJSON()
        }
        socket.emit("create_message", messageObject);
        setMessages(prev => [messageObject, ...prev])

        textRef.current.style.height = '24px'
        setMessage("")
    }
    return (
        <div className='flex w-full px-3 py-2 bg-[#313167] space-x-4'>
            <div className='h-6 w-6 bg-red-800'>A</div>
            <textarea
                className='h-6 max-h-72 w-[80%] resize-none text-sm bg-transparent outline-none cursor-text'
                placeholder={`Message ${props.channelId}`}
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
            <div className='h-6 w-6 bg-red-800'>B</div>
            <div className='h-6 w-6 bg-red-800'>C</div>
            <div className='h-6 w-6 bg-red-800'>D</div>
            <div className='h-6 w-6 bg-red-800'>E</div>
        </div>
    )
}

export default ChatBox