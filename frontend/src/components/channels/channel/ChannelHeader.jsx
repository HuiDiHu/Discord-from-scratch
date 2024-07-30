import React from 'react'
import FriendIcon from '../friends/FriendIcon'

const ChannelHeader = ({ props }) => {
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
          <div className='h-5 w-5 bg-red-600'></div>
        </div>
      }
    </div>
  )
}

export default ChannelHeader