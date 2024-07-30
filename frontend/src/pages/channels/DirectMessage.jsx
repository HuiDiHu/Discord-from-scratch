import React, { useContext, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FriendContext, LoadingContext } from 'src/pages/Channels'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import Channel from 'src/components/channels/Channel'

const DirectMessage = () => {
  const { friendList } = useContext(FriendContext)
  const { msgLoading } = useContext(LoadingContext)
  const { id } = useParams();

  const [friend, setFriend] = useState()
  useLayoutEffect(() => {
    setFriend(friendList.find(item => item.userid === id))
  }, [friendList, id])
  return (
    <div className='flex w-full h-full'>
      <FriendsAndDMSidebar />
      {friend && !msgLoading ?
        <Channel props={{
          channelId: friend.dm_id,
          channel_name: `@${friend.username}`,
          channelType: 'dm',
          friend
        }} /> :
        <div className='grow text-center text-red-800 text-3xl'>LOADING...</div>
      }
    </div>
  )
}

export default DirectMessage