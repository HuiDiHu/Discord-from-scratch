import React, { useContext, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FriendContext } from 'src/pages/Channels'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import Channel from 'src/components/channels/Channel'
import ChannelSkeleton from 'src/components/skeleton/ChannelSkeleton'

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

const DirectMessage = () => {
  const { friendList } = useContext(FriendContext)
  const { id } = useParams();

  const [friend, setFriend] = useState(null)
  const [skeletonSeed, setSkeletonSeed] = useState("default")

  useLayoutEffect(() => {
    if (friendList !== null) {
      setSkeletonSeed(generateRandomString(100))
      setFriend(friendList.find(item => item.userid === id))
    }
  }, [friendList !== null, id])
  return (
    <div className='flex w-full h-full'>
      <FriendsAndDMSidebar />
      {friend ?
        <Channel props={{
          channelId: friend.dm_id,
          channel_name: `@${friend.username}`,
          channelType: 'dm',
          friend,
          skeletonSeed
        }} /> :
        <ChannelSkeleton skeletonSeed={skeletonSeed} channelType={'dm'}/>
      }
    </div>
  )
}

export default DirectMessage