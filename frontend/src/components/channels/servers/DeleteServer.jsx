import { FaTrashCan } from "react-icons/fa6";

const DeleteServer = ({ setServerOptionsOpen, setDeleteServerModal }) => {

    return (
        <div
            className='group/leave flex items-center justify-between px-2 py-1.5 w-[92%] mx-auto rounded-sm hover:bg-red-600 cursor-pointer'
            onClick={() => {
                setServerOptionsOpen(false)
                setDeleteServerModal(true)
            }}
        >
            <span className='text-sm text-red-600 group-hover/leave:text-white'>Delete Server</span>
            <FaTrashCan
                className='h-[18px] w-[18px] text-red-600 group-hover/leave:text-white'
            />
        </div>
    )
}

export default DeleteServer