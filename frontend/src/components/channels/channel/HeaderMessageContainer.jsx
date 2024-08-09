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
        <li
            className={`flex-shrink-0 min-h-0 relative group w-full py-0.5 ${!isEditing && props.hoveredMessage === props.psudoId ? 'bg-gradient-to-r to-[#303338] from-[#313167]' : ''} flex items-start pr-10 mt-4`}
            onMouseOverCapture={() => props.setHoveredMessage(props.psudoId)}
            onMouseLeave={() => props.setHoveredMessage(null)}
        >
            <img
                className='w-10 h-10 rounded-full [clip-path:circle(45%_at_50%_50%)] ml-3 mr-2 cursor-pointer'
                src={props.author.profile || `../../../../assets/tempIcons/GRAGAS.png`}
                onClick={() => { alert(`${props.author.username}'s profile...`) }}
            />
            <div className='w-full flex flex-col'>
                <div className='flex space-x-2'>
                    <span>{props.author.username}</span>
                    <span className='text-neutral-400 flex items-center justify-center text-xs mt-0.5 whitespace-pre'>
                        {formatDate(new Date(props.message.created_at))}
                    </span>
                </div>

                {isEditing && <EditMessageContainer props={{ message: props.message, setIsEditing, index: props.index }} />}

                {!isEditing &&
                    <p className='text-wrap w-fit text-sm font-light inline whitespace-pre-wrap'>
                        <span className='inline'>
                            <span className='break-all'>{props.message.content}</span>
                            {props.message.is_edited ? 
                                <span className='text-neutral-500 text-[8px] font-medium break-words'>
                                    {"  "}(edited)
                                </span> : ""
                            }
                        </span>
                    </p>
                }

            </div>
            <div className={`absolute right-5 -top-4 ${!isEditing && props.hoveredMessage === props.psudoId ? 'flex' : 'hidden'}`}>
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
        </li>
    )
}

export default HeaderMessageContainer