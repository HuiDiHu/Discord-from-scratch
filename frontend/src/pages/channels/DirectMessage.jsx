import React, { useContext, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FriendContext } from 'src/pages/Channels'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import Channel from 'src/components/channels/Channel'

const DirectMessage = () => {
  const { friendList } = useContext(FriendContext)
  const { id } = useParams();

  const [friend, setFriend] = useState(null)
  useLayoutEffect(() => {
    if (friendList !== null) {
      setFriend(friendList.find(item => item.userid === id))
    }
  }, [friendList, id])
  return (
    <div className='flex w-full h-full'>
      <FriendsAndDMSidebar />
      {friend ?
        <Channel props={{
          channelId: friend.dm_id,
          channel_name: `@${friend.username}`,
          channelType: 'dm',
          friend
        }} /> :
        <div className='grow text-center text-red-800 text-3xl'>LOADING STAGE 1...</div>
      }
    </div>
  )
}

export default DirectMessage