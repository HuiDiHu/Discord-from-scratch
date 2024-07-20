import React from 'react'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'

const Friends = () => {
  return (
    <div className='flex w-full h-screen'>
      <FriendsAndDMSidebar />
      <div className='grow flex flex-col'>
        Friend list filtered by who is online
      </div>
    </div>
  )
}

export default Friends