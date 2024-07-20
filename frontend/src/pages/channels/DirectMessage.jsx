import React from 'react'
import { useParams } from 'react-router-dom'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'

const DirectMessage = () => {
  const { id } = useParams();

  return (
    <div className='flex w-full h-full'>
      <FriendsAndDMSidebar />
      <div className='grow flex flex-col'>
        DM with friend id: {id}
      </div>
    </div>
  )
}

export default DirectMessage