import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";

const EditServerProfile = ({ setServerOptionsOpen, setImportProfilePictureModalOpen }) => {
    return (
        <div
            className='relative group/edit flex items-center justify-between px-2 py-1.5 w-[92%] mx-auto rounded-sm hover:bg-[#313167ff] cursor-pointer'
            onClick={() => {
                setServerOptionsOpen(false);
                setImportProfilePictureModalOpen(true);
            }}
        >
            <span className='text-sm text-neutral-400 group-hover/edit:text-white'>Edit Server Profile</span>
            <FaPencilAlt
                className='h-[18px] w-[18px] text-neutral-400 group-hover/edit:text-white'
            />
        </div>
    )
}

export default EditServerProfile