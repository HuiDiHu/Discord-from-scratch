import React, { useContext, useState } from 'react'
import axios from 'axios';
import socket from 'src/socket'
import { IoMdClose } from "react-icons/io";
import { ServerContext, LoadingContext } from 'src/pages/Channels'
import { AccountContext } from 'src/components/auth/UserContext'
import { useNavigate } from 'react-router-dom';

const AddServerModal = ({ props }) => {
    const { user } = useContext(AccountContext);
    const { setServerList } = useContext(ServerContext);
    const { setMsgLoading, setSidebarLoading } = useContext(LoadingContext);

    const [serverName, setServerName] = useState(`${user.username}'s server`);
    const [serverNameErrMsg, setServerNameErrMsg] = useState("");
    const [inviteToken, setInviteToken] = useState("");
    const [inviteTokenErrMsg, setInviteTokenErrMsg] = useState("");

    const navigate = useNavigate();
    const handleAddServer = () => {
        if (!serverName) { setServerNameErrMsg("Server name cannot be empty!"); return; }
        if (serverName.length > 50) { setServerNameErrMsg("Server name is too long!"); return; }

        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .post('/api/v1/servers/create', { server_name: serverName })
            .then((res) => {
                setServerList(prev => [...prev, res.data.server])
                setMsgLoading(true); setSidebarLoading(true);
                props.setIsAddServerOpen(false)
                props.setSelectedPath(`/server/${res.data.server.server_id}`)
                navigate(`/channels/server/${res.data.server.server_id}`)
            })
            .catch((error) => {
                setServerNameErrMsg('Server name already taken!')
            })
    }

    const handleJoinServer = () => {
        if (!inviteToken) { setInviteTokenErrMsg("Invite token cannot be empty!"); return; }

        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .put(`/api/v1/servers/join/${inviteToken}`)
            .then((res) => {
                //send socket request to other members
                setMsgLoading(true); setSidebarLoading(true);
                props.setIsAddServerOpen(false)
                props.setSelectedPath(`/server/${res.data.server.server_id}`)
                const { server_members, ...targetServer } = res.data.server;
                socket.emit("joined_server", user, targetServer);
            })
            .catch((error) => {
                console.log(error)
                setInviteTokenErrMsg(error.response.data.msg)
            })
    }

    return (
        <div
            className='h-screen w-screen overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={() => { props.setIsAddServerOpen(false) }}
        >
            <div
                className='relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%] h-[450px] bg-[#31313c] rounded-3xl flex flex-col py-5 px-10'
                onClick={(e) => e.stopPropagation()}
            >
                <span className='text-3xl font-medium w-full text-center'>Create a server!</span>
                <br />
                <br />
                <>
                    <span className='text-sm text-neutral-400 mb-2'>SERVER NAME</span>
                    <div className={`border-2 ${serverNameErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2`}>
                        <input
                            className='bg-transparent w-[90%] outline-none'
                            placeholder='Enter a server name...'
                            autoFocus={true}
                            type='text'
                            value={serverName}
                            onChange={(e) => {
                                setServerName(e.target.value)
                                if (!e.target.value) {
                                    setServerNameErrMsg("Server name cannot be empty!")
                                } else if (e.target.value.length > 50) {
                                    setServerNameErrMsg("Server name is too long!")
                                } else {
                                    setServerNameErrMsg("")
                                }
                            }}
                            onKeyDown={(e) => { e.key === "Enter" && handleAddServer() }}
                        />
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{serverNameErrMsg}</span>
                    </div>
                    <div className='w-full flex justify-end'>
                        <button
                            className='bg-[#203FAF] rounded-xl py-4 text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 w-28 mr-5 mb-3'
                            onClick={handleAddServer}
                        >
                            Create
                        </button>
                    </div>
                </>
                <span className='w-full border mb-4'></span>
                <>
                    <span className='text-xl font-medium w-full text-center'>Have a invite token already?</span>
                    <span className='text-sm text-neutral-400 mb-2'>INVITE TOKEN</span>
                    <div className={`border-2 ${inviteTokenErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2 flex justify-between`}>
                        <input
                            className='bg-transparent w-[70%] outline-none text-xl'
                            placeholder='Y3dOkX'
                            type='text'
                            value={inviteToken}
                            onChange={(e) => {
                                setInviteToken(e.target.value)
                                if (!e.target.value) {
                                    setInviteTokenErrMsg("Invite token cannot be empty!")
                                } else {
                                    setInviteTokenErrMsg("")
                                }
                            }}
                            onKeyDown={(e) => { e.key === "Enter" && handleJoinServer() }}
                        />
                        <button
                            className='bg-[#203FAF] rounded-xl py-2 text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 w-16 mr-5'
                            onClick={handleJoinServer}
                        >
                            Join
                        </button>
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{inviteTokenErrMsg}</span>
                    </div>
                </>
                <IoMdClose
                    className='absolute top-4 right-4 w-6 h-6 cursor-pointer'
                    onClick={() => { props.setIsAddServerOpen(false) }}
                />
            </div>
        </div>
    )
}

export default AddServerModal