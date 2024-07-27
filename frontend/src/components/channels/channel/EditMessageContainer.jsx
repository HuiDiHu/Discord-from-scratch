import React, { useRef, useState } from 'react'

const EditMessageContainer = ({ props }) => {
    const [message, setMessage] = useState(props.message.content)
    const textRef = useRef();

    const handleSubmit = () => {
        props.setIsEditing(false)
    }
    return (
        <div className='flex flex-col w-full bg-gradient-to-r py-3 px-4 pb-2 rounded-lg from-[#313167] to-[#303338]'>
            <textarea
                className='h-6 max-h-72 w-[95%] resize-none text-sm bg-transparent outline-none cursor-text'
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
            <span className='border my-1 ml-2 mr-16 border-neutral-500'/>
            <p className='flex text-[10px] whitespace-pre'>
                <span>escape to </span>  
                <span 
                    className='text-sky-500 hover:underline cursor-pointer'
                    onClick={() => {props.setIsEditing(false)}}
                >cancel</span>
                <span className='text-neutral-500'> | </span><span>enter to </span> 
                <span 
                    className='text-sky-500 hover:underline cursor-pointer'
                    onClick={handleSubmit}
                >save</span>
            </p>
        </div>
    )
}

export default EditMessageContainer