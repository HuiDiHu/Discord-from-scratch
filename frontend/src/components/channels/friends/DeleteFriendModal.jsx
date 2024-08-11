import axios from "axios";
import { useContext } from "react";
import { FriendContext } from "src/pages/Channels";
import { AccountContext } from "src/components/auth/UserContext";

const DeleteFriendModal = ({ props }) => {

    const { setFriendList } = useContext(FriendContext)
    const { user } = useContext(AccountContext)

    const handleDeleteFriend = () => {
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .delete(`/api/v1/user/unfriend/${props.friend_id}.${props.dm_id}`)
            .then((res) => {
                if (res.data.friend_id !== props.friend_id) {
                    console.log(`DELETED FRIEND ID: ${res.data.friend_id} DOES NOT MATCH REQUESTED FRIEND ID: ${props.friend_id}`)
                } else {
                    setFriendList(prev => prev.filter(item => item.userid !== props.friend_id))
                    props.setDeleteFriendModalOpen(false);
                    props.setFriendSettingOpen(null);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div
            className='h-screen w-screen overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={(e) => {
                e.stopPropagation();
                props.setDeleteFriendModalOpen(false);
                props.setFriendSettingOpen(null);
            }}
        >
            <div
                className='relative w-[85%] sm:w-[70%] md:w-[50%] lg:w-[35%] h-[250px] bg-[#31313c] rounded-xl flex flex-col pt-5 pb-2.5 px-6'
                onClick={(e) => e.stopPropagation()}
            >
                <span className='truncate text-xl font-medium'> Unfriend "{props.friend_username}" </span>
                <br />
                <p className="whitespaces-pre text-neutral-400">
                    <span>Are you sure you want to permanently remove</span>
                    <span className="font-bold text-white">{" "}{props.friend_username}{" "}</span>
                    <span>from your friendlist?</span>
                </p>
                <div className="grow" />
                <div className='flex justify-end space-x-5 mb-2 border-t border-neutral-500 pt-4'>
                    <button
                        className="group/cancel px-4 py-1.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setDeleteFriendModalOpen(false);
                            props.setFriendSettingOpen(null);
                        }}
                    >
                        <span className="text-sm group-hover/cancel:underline">Cancel</span>
                    </button>
                    <button
                        className="group/delete px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFriend();
                        }}
                    >
                        <span className="text-sm">Delete Friend</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteFriendModal