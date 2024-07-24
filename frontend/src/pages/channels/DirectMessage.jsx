import React, { useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AccountContext } from 'src/components/auth/UserContext'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import Channel from 'src/components/channels/Channel'

const DirectMessage = () => {
  const { user } = useContext(AccountContext)
  const { id } = useParams();
  return (
    <div className='flex w-full h-full'>
      <FriendsAndDMSidebar />
      <Channel props={{
        channelId: id,
        members: [user.userid, id]
      }} />
    </div>
  )
}

export default DirectMessage