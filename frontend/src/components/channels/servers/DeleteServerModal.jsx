import React, { useContext, useState } from 'react'
import axios from "axios";
import socket from 'src/socket'
import { ServerContext } from 'src/pages/Channels'
import { useNavigate } from 'react-router-dom';

const DeleteServerModal = ({ setDeleteServerModal, server_id, server_name }) => {
    const { setServerList } = useContext(ServerContext)
    const [verifyServerNameInput, setVerifyServerNameInput] = useState("");
    const [errMsg, setErrMsg] = useState("")

    const navigate = useNavigate();
    const handleDeleteServer = (e) => {
        e.stopPropagation();
        if (!verifyServerNameInput) {
            setErrMsg("Server name cannot be empty")
            return;
        }
        if (verifyServerNameInput !== server_name) {
            setErrMsg("You didn't enter the server name correctly")
            return;
        }
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .delete(`/api/v1/servers/delete/${server_id}`)
            .then(() => {
                socket.emit('delete_server', Number(server_id))
                setServerList(prev => prev.filter(item => item.server_id !== Number(server_id)))
                navigate('/channels/@me')
                setDeleteServerModal(false);

            })
            .catch((error) => {
                setErrMsg(error.response.data.msg)
                console.log(error)
            })
    }

    return (
        <div
            className='h-screen w-screen overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={() => { setDeleteServerModal(false) }}
        >
            <div
                className='relative w-[85%] sm:w-[70%] md:w-[50%] lg:w-[35%] h-[350px] bg-[#31313c] rounded-xl flex flex-col py-5 px-6'
                onClick={(e) => e.stopPropagation()}
            >
                <span className='truncate text-2xl font-medium'> Delete "{server_name}" </span>
                <br />
                <div className='w-full bg-yellow-500 rounded-md p-3 whitespace-pre text-wrap'>
                    <span>Are you sure you want to delete</span>
                    <span className='font-bold'>{" "}{server_name}</span>
                    <span>? This action </span>
                    <span className='text-red-600 font-bold'>cannot be undone</span>
                </div>
                <br />
                <span className='text-neutral-400 font-bold text-sm mb-2'>VERIFY SERVER NAME</span>
                <div className='bg-[#1e1e1e] rounded-sm p-2'>
                    <input
                        value={verifyServerNameInput}
                        className='outline-none w-full'
                        onChange={(e) => {
                            setVerifyServerNameInput(e.target.value)
                        }}
                        onKeyDown={(e) => { e.key === "Enter" && handleDeleteServer(e) }}
                    />
                </div>
                <div className="h-8 w-full">
                    <span className="text-red-600 text-xs">{errMsg}</span>
                </div>
                <br />
                <div className='flex justify-end space-x-5 mb-2'>
                    <button
                        className="group/cancel px-4 py-1.5"
                        onClick={() => { setDeleteServerModal(false) }}
                    >
                        <span className="text-sm group-hover/cancel:underline">Cancel</span>
                    </button>
                    <button
                        className="group/delete px-4 py-1.5 bg-red-500 hover:bg-red-600 rounded-sm"
                        onClick={(e) => handleDeleteServer(e)}
                    >
                        <span className="text-sm">Delete Server</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteServerModal