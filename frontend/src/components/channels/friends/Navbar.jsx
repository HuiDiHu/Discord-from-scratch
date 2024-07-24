import React from 'react'

const Navbar = ({ props }) => {
  return (
    <div className='flex items-center w-full space-x-4 h-12'>
        <div className='px-3 border-r'>
            Friends
        </div>
        <button 
            className={`px-3 ${props.selectedSection === 'Online' ? 'bg-[#404248]' : 'hover:bg-[#36383c]'} transition-all duration-300 ease-in-out rounded-md`}
            onClick={() => { props.setSelectedSection('Online') }}
        >
            Online
        </button>
        <button 
            className={`px-3 ${props.selectedSection === 'All' ? 'bg-[#404248]' : 'hover:bg-[#36383c]'} transition-all duration-300 ease-in-out rounded-md`}
            onClick={() => { props.setSelectedSection('All') }}
        >
            All
        </button>
        <button 
            className={`px-3 ${props.selectedSection === 'Pending' ? 'bg-[#404248]' : 'hover:bg-[#36383c]'} transition-all duration-300 ease-in-out rounded-md`}
            onClick={() => { props.setSelectedSection('Pending') }}
        >
            Pending
        </button>
        <button 
            className={`px-3 ${props.isAddFriendOpen ? 'text-green-500' : 'bg-green-500'} transition-all duration-300 ease-in-out rounded-md`}
            onClick={() => { props.setIsAddFriendOpen(!props.isAddFriendOpen) }}
        >
            Add Friend
        </button>
    </div>
  )
}

export default Navbar