import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AccountContext } from 'src/components/auth/UserContext'
import { FriendContext } from 'src/pages/Channels'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import Channel from 'src/components/channels/Channel'

const DirectMessage = () => {
  const { user } = useContext(AccountContext)
  const { friendList } = useContext(FriendContext)
  const { id } = useParams();

  const [loading, setLoading] = useState(false)
  const [friend, setFriend] = useState()
  useEffect(() => {
    setFriend(friendList.find(item => item.userid === id))
  }, [friendList, id])
  return (
    <div className='flex w-full h-full'>
      <FriendsAndDMSidebar />
      {friend ?
        <Channel props={{
          channelId: friend.dm_id,
          channelName: `@${friend.username}`,
          channelType: 'dm',
          loading, setLoading,
          friend
        }} /> :
        <div className='grow text-center text-red-800 text-3xl'>LOADING...</div>
      }
    </div>
  )
}

export default DirectMessage