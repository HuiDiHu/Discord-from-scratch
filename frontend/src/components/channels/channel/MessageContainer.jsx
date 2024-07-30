import React, { useState } from 'react'
import { IoCopy } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import EditMessageContainer from './EditMessageContainer';

const MessageContainer = ({ props }) => {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div
            className={`relative group w-full py-0.5 ${!isEditing && props.hoveredMessage === props.psudoId ? 'bg-gradient-to-r to-[#303338] from-[#313167]' : ''} flex items-start pr-10`}
            onMouseOverCapture={() => props.setHoveredMessage(props.psudoId)}
            onMouseLeave={() => props.setHoveredMessage(null)}
        >
            <span className={`${props.hoveredMessage === props.psudoId ? 'text-neutral-500' : 'text-transparent'} w-[60px] flex items-center justify-center text-[10px] mt-0.5`}>
                {(new Date(props.message.created_at)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
            </span>

            {isEditing && <EditMessageContainer props={{ message: props.message, setIsEditing, index: props.index }} />}

            {!isEditing &&
                <span className='flex text-wrap w-fit break-all text-sm font-light whitespace-pre'>
                    {props.message.content}
                    {props.message.is_edited ? <span className='text-neutral-500 text-[8px] ml-1 font-medium pt-0.5'>{'(edited)'}</span> : ''}
                </span>
            }

            <div className={`absolute right-5 -top-6 hover:flex ${!isEditing && props.hoveredMessage === props.psudoId ? 'flex' : 'hidden'}`}>
                <button
                    className={`group/copy relative p-2 bg-[#2a2d31] rounded-l-md ${!props.by_user ? 'rounded-r-md' : ''} hover:bg-neutral-500`}
                    onClick={() => {
                        navigator.clipboard.writeText(props.message.content)
                    }}
                >
                    <IoCopy className='h-5 w-5' />
                    <div className='absolute -top-8 -left-1.5 hidden group-hover/copy:block px-2 py-0.5 rounded-md bg-black'>
                        <span className='text-xs'>Copy</span>
                    </div>
                </button>
                <button
                    className={`group/edit relative ${!props.by_user ? 'hidden' : ''} p-2 bg-[#2a2d31] hover:bg-neutral-500`}
                    onClick={() => {
                        setIsEditing(true)
                    }}
                >
                    <RiEdit2Fill className='h-5 w-5' />
                    <div className='absolute -top-8 -left-[5px] hidden group-hover/edit:block px-3 py-0.5 rounded-md bg-black'>
                        <span className='text-xs'>Edit</span>
                    </div>
                </button>
                <button
                    className={`group/delete relative ${!props.by_user ? 'hidden' : ''} p-2 bg-[#2a2d31] rounded-r-md hover:bg-neutral-500`}
                    onClick={() => { props.handleDeleteMessage(props.message.message_id, props.message.in_dm, props.message.in_channel, props.message.posted_by) }}
                >
                    <MdDeleteForever className='h-5 w-5' />
                    <div className='absolute -top-8 -left-2.5 hidden group-hover/delete:block px-2 py-0.5 rounded-md bg-black'>
                        <span className='text-xs text-red-600'>Delete</span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default MessageContainer