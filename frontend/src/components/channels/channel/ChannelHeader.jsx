import React, { useContext } from 'react'
import FriendIcon from '../friends/FriendIcon'
import { MemberContext } from 'src/pages/Channels'
import { BsPeopleFill } from "react-icons/bs";

const ChannelHeader = ({ props }) => {
  const { memberListOpen, setMemberListOpen } = useContext(MemberContext)
  return (
    <div className='min-h-12 w-auto bg-[#313167ff] border-b border-black'>
      {props.channelType === 'dm' &&
        <div className="h-full flex items-center ml-2">
          <FriendIcon props={{ friend: { ...props.friend, username: `@${props.friend.username}` }, selected: true }} />
        </div>
      }
      {props.channelType === 'channel' &&
        <div className='h-full flex justify-between items-center mx-5'>
          <div className='flex'>
            <span className='text-md font-medium'>{props.channel_name}</span>
          </div>
          <BsPeopleFill 
            className={`h-5 w-5 ${memberListOpen ? 'text-white' : 'text-neutral-500'} ease-in-out duration-300 cursor-pointer`}
            onClick={() => {setMemberListOpen(prev => !prev)}}
          />
        </div>
      }
    </div>
  )
}

export default ChannelHeader