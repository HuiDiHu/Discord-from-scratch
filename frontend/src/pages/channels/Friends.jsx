import React, { useContext, useState } from 'react'
import FriendsAndDMSidebar from 'src/components/channels/FriendsAndDMSidebar'
import AddFriendModal from 'src/components/channels/friends/AddFriendModal'
import Navbar from 'src/components/channels/friends/Navbar'
import { FriendContext } from 'src/pages/Channels'


const Friends = () => {
  const [selectedSection, setSelectedSection] = useState('Online')
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false)
  const { friendList, setFriendList } = useContext(FriendContext)

  return (
    <div className='flex w-full h-screen'>
      <FriendsAndDMSidebar />
      <div className='grow flex flex-col'>
        <Navbar props={{ selectedSection, setSelectedSection, isAddFriendOpen, setIsAddFriendOpen }} />
        <div>{selectedSection}</div>
      </div>
      {isAddFriendOpen && <AddFriendModal props={{ setIsAddFriendOpen }} />}
    </div>
  )
}

export default Friends