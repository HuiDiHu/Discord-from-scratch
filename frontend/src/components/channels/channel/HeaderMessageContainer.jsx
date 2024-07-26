import React, { useContext } from 'react'
import { AccountContext } from 'src/components/auth/UserContext'
import { format, isToday, isYesterday } from 'date-fns';

const formatDate = (date) => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  return `${format(date, 'MM/dd/yyyy')} at ${format(date, 'h:mm a')}`;
};

const HeaderMessageContainer = ({ props }) => {
    const { user } = useContext(AccountContext)
    return (
        <div className='group w-full py-0.5 hover:bg-red-600 flex items-start pr-10 mt-4'>
            <img
                className='w-10 h-10 rounded-full [clip-path:circle(45%_at_50%_50%)] ml-3 mr-2 cursor-pointer'
                src={`../../../../assets/tempIcons/${props.member.profile || 'GRAGAS'}.png`}
                onClick={() => {alert(`${props.member.username}'s profile...`)}}
            />
            <div className='flex flex-col'>
                <div className='flex space-x-2'>
                    <span>{props.member.username}</span>
                    <span className='text-neutral-400 flex items-center justify-center text-xs mt-0.5 whitespace-pre'>
                        {formatDate(new Date(props.message.created_at))}
                    </span>
                </div>
                <span className='text-wrap w-fit break-all text-sm font-light'>
                    {props.message.content}
                </span>
            </div>
        </div>
    )
}

export default HeaderMessageContainer