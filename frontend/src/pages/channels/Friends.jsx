import React, { useState } from 'react'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import AddFriendModal from 'src/components/channels/friends/AddFriendModal'
import Navbar from 'src/components/channels/friends/Navbar'
import FriendListContainer from 'src/components/channels/friends/FriendListContainer'


const Friends = () => {
  const [selectedSection, setSelectedSection] = useState('Online')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)

  return (
    <div className='flex w-full h-screen bg-[#303338]'>
      <FriendsAndDMSidebar />
      <div className='grow flex flex-col'>
        <Navbar props={{ selectedSection, setSelectedSection, isAddFriendOpen, setIsAddFriendOpen }} />
        <div className='flex flex-col px-8 py-4'>
          {selectedSection !== "Pending" ? <FriendListContainer props={{ selectedSection }}/> : selectedSection}
        </div>
      </div>
      {isAddFriendOpen && <AddFriendModal props={{ setIsAddFriendOpen }} />}
    </div>
  )
}

export default Friends