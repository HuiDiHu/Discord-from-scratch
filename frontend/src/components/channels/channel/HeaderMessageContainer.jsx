import React, { useState } from 'react'
import { format, isToday, isYesterday } from 'date-fns';
import { IoCopy } from "react-icons/io5";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import EditMessageContainer from './EditMessageContainer';

const formatDate = (date) => {
    if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    return `${format(date, 'MM/dd/yyyy')} at ${format(date, 'h:mm a')}`;
};

const HeaderMessageContainer = ({ props }) => {
    const [isEditing, setIsEditing] = useState(false)
    return (
        <div 
            className={`relative group w-full py-0.5 ${isEditing ? '' : 'hover:bg-gradient-to-r hover:to-[#303338] hover:from-[#313167]'} flex items-start pr-10 mt-4`}
            onMouseOverCapture={() => props.setHoveredMessage(props.psudoId)}
        >
            <img
                className='w-10 h-10 rounded-full [clip-path:circle(45%_at_50%_50%)] ml-3 mr-2 cursor-pointer'
                src={`../../../../assets/tempIcons/${props.member.profile || 'GRAGAS'}.png`}
                onClick={() => { alert(`${props.member.username}'s profile...`) }}
            />
            <div className='w-full flex flex-col'>
                <div className='flex space-x-2'>
                    <span>{props.member.username}</span>
                    <span className='text-neutral-400 flex items-center justify-center text-xs mt-0.5 whitespace-pre'>
                        {formatDate(new Date(props.message.created_at))}
                    </span>
                </div>

                {isEditing && <EditMessageContainer props={{ message: props.message, setIsEditing }} />}

                {!isEditing &&
                    <span className='text-wrap w-fit break-all text-sm font-light'>
                        {props.message.content}
                    </span>
                }

            </div>
            <div className={`absolute right-5 -top-4 hidden ${isEditing ? '' : ' group-hover:flex hover:flex'}`}>
                <button
                    className={`group/copy relative p-2 bg-[#2a2d31] rounded-l-md ${props.by_user ? 'rounded-r-md' : ''} hover:bg-neutral-500`}
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
                    className={`group/edit relative ${props.by_user ? 'hidden' : ''} p-2 bg-[#2a2d31] hover:bg-neutral-500`}
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
                    className={`group/delete relative ${props.by_user ? 'hidden' : ''} p-2 bg-[#2a2d31] rounded-r-md hover:bg-neutral-500`}
                    onClick={() => { props.handleDeleteMessage() }}
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

export default HeaderMessageContainer