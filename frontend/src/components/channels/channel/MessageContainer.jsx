import React, { useContext } from 'react'
import { AccountContext } from 'src/components/auth/UserContext'


const MessageContainer = ({ props }) => {
    const { user } = useContext(AccountContext)

    return (
        <div className='group w-full py-0.5 hover:bg-red-600 flex items-start pr-10'>
            <span className='group-hover:text-neutral-500 w-16 flex items-center justify-center text-transparent text-[10px] mt-0.5'>
                {(new Date(props.message.created_at)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </span>
            <span className='text-wrap w-fit break-all text-sm'>
                {props.message.content}
            </span>
        </div>
    )
}

export default MessageContainer