import React, { useContext, useEffect, useRef, useState } from 'react'
import { AccountContext } from 'src/components/auth/UserContext'
import { MessagesContext } from 'src/pages/Channels';
import socket from 'src/socket'


const EditMessageContainer = ({ props }) => {
    const [message, setMessage] = useState("")
    const textRef = useRef();
    const { user } = useContext(AccountContext)
    const { setMessages } = useContext(MessagesContext)

    const editRef = useRef();

    const handleSubmit = (e) => {
        e.stopPropagation(); e.preventDefault();
        props.setIsEditing(false)
        if (!message) return;
        if (props.index < 0 || message === props.message.content) return;
        if (props.message.posted_by !== user.userid) {
            alert("You can only edit your own messages!")
            return;
        }
        const newMessage = props.message;
        newMessage.content = message; newMessage.is_edited = 1;
        if (props.message.in_dm !== null && props.message.in_dm !== undefined) {
            setMessages(prev => prev.map(item => {
                if (item.in_dm === props.message.in_dm && item.message_id === props.message.message_id) {
                    item = newMessage;
                }
                return item;
            }))
            socket.emit("edit_message", newMessage)
        } else if (props.message.in_channel !== null && props.message.in_channel !== undefined) {
            setMessages(prev => prev.map(item => {
                if (item.in_channel === props.message.in_channel && item.message_id === props.message.message_id) {
                    item = newMessage;
                }
                return item;
            }))
            socket.emit("edit_message", newMessage)
        }
    }

    useEffect(() => {
        const { current } = editRef;
        if (current !== null) { current.scrollIntoView({ behavior: "smooth",  block: 'center', inline: 'nearest' }) }
    }, [])

    return (
        <div
            ref={editRef}
            className='flex flex-col w-full bg-gradient-to-r py-3 px-4 pb-2 rounded-lg from-[#313167] to-[#303338]'
        >
            <textarea
                className='h-6 max-h-72 w-[95%] resize-none text-sm bg-transparent outline-none cursor-text'
                autoFocus={true}
                ref={textRef}
                onFocus={() => {
                    setMessage(props.message.content);
                    setTimeout(() => { if (textRef.current !== undefined) textRef.current.style.height = `${textRef.current.scrollHeight}px` }, 10)
                }}
                autoComplete='off'
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
                    onClick={(e) => { handleSubmit(e) }}
                >save</span>
            </p>
        </div>
    )
}

export default EditMessageContainer