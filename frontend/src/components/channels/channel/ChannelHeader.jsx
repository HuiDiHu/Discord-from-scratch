import React from 'react'
import FriendIcon from '../friends/FriendIcon'

const ChannelHeader = ({ props }) => {
  return (
    <div className='min-h-12 w-auto bg-[#313167ff]'>
      {props.channelType === 'dm' &&
        <div className="h-full flex items-center ml-2">
          <FriendIcon props={{ friend: {...props.friend, username: `@${props.friend.username}`}, selected: true }} />
        </div>
      }
    </div>
  )
}

export default ChannelHeader