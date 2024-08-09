import React, { useState } from 'react'
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteFriendModal from './DeleteFriendModal';

const DeleteFriend = ({ setFriendSettingOpen, friend_username, friend_id, dm_id }) => {
    const [deleteFriendModalOpen, setDeleteFriendModalOpen] = useState(false);
    return (
        <div
            className='relative rounded-full p-1.5 hover:bg-neutral-600 mx-2'
            onClick={(e) => {
                e.stopPropagation();
                setDeleteFriendModalOpen(true)
            }}
        >
            <FaRegTrashAlt className='h-5 w-5 text-red-600' />
            {deleteFriendModalOpen && <DeleteFriendModal props={{
                setDeleteFriendModalOpen,
                setFriendSettingOpen,
                friend_username,
                friend_id, dm_id
            }} />}
        </div>
    )
}

export default DeleteFriend