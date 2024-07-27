import React, { useContext, useRef, useState } from 'react'
import { AccountContext } from 'src/components/auth/UserContext'
import { MessagesContext } from 'src/pages/Channels';
import socket from 'src/socket'


const EditMessageContainer = ({ props }) => {
    const [message, setMessage] = useState("")
    const textRef = useRef();
    const { user } = useContext(AccountContext)
    const { setMessages } = useContext(MessagesContext)

    const handleSubmit = () => {
        props.setIsEditing(false)
        if (props.index < 0 || message === props.message.content) return;
        if (props.message.posted_by !== user.userid) {
            alert("You can only edit your own messages!")
            return;
        }
        if (props.message.in_dm !== null) {
            const newMessage = props.message;
            newMessage.content = message; newMessage.is_edited = 1;

            setMessages(prev => prev.with(props.index, newMessage))
            socket.emit("edit_message", newMessage, props.index)
        } else if (props.message.in_channel !== null) {}
    }

    return (
        <div className='flex flex-col w-full bg-gradient-to-r py-3 px-4 pb-2 rounded-lg from-[#313167] to-[#303338]'>
            <textarea
                className='h-6 max-h-72 w-[95%] resize-none text-sm bg-transparent outline-none cursor-text'
                autoFocus={true}
                onFocus={() => setMessage(props.message.content)}
                autoComplete='off'
                ref={textRef}
                onChange={(e) => {
                    setMessage(e.target.value)
                    textRef.current.style.height = '24px'
                    textRef.current.style.height = `${textRef.current.scrollHeight}px`
                }}
                value={message}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                    if (e.key === "Escape") props.setIsEditing(false);
                }}

            />
            <span className='border my-2 mr-16 border-neutral-500' />
            <p className='flex text-[10px] whitespace-pre'>
                <span>escape to </span>
                <span
                    className='text-sky-500 hover:underline cursor-pointer'
                    onClick={() => { props.setIsEditing(false) }}
                >cancel</span>
                <span className='text-neutral-500'> | </span><span>enter to </span>
                <span
                    className='text-sky-500 hover:underline cursor-pointer'
                    onClick={(e) => {handleSubmit(e)}}
                >save</span>
            </p>
        </div>
    )
}

export default EditMessageContainer