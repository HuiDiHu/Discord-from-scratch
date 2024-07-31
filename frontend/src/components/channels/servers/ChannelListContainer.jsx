import axios from 'axios'
import React, { useContext, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServerContext, LoadingContext, MessagesContext } from 'src/pages/Channels'
import { PiDiamondsFourDuotone } from "react-icons/pi";
import socket from 'src/socket';

const ChannelListContainer = ({ props }) => {
  const { channels, setChannels, loadedChannels, setLoadedChannels } = useContext(ServerContext)
  const { sidebarLoading, setSidebarLoading, setMsgLoading } = useContext(LoadingContext)
  const { setMessages } = useContext(MessagesContext)

  const [addingChannel, setAddingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");

  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (channels.length === 0 || props.selectedChannel.channel_id === null) return;
    setSidebarLoading(false);
    if (loadedChannels.find(item => item === props.selectedChannel.channel_id)) {
      setMsgLoading(false);
      return;
    };
    setMsgLoading(true);
    //load messages
    axios
      .create({
        baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
        withCredentials: true
      })
      .get(`/api/v1/messages/channels/${props.selectedChannel.channel_id}`)
      .then((res) => {
        setLoadedChannels(prev => [props.selectedChannel.channel_id, ...prev]);
        setMessages(prev => [...res.data, ...prev]);
        setMsgLoading(false); //after querying messages successfully
      })
      .catch((error) => {
        console.log(error)
        navigate('/channels/@me')
        setMsgLoading(false)
      })
  }, [channels, props.selectedChannel.channel_id])

  const handleAddChannel = (e) => {
    e.stopPropagation();
    setAddingChannel(false);
    if (!newChannelName) return;
    axios
      .create({
        baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
        withCredentials: true
      })
      .post('/api/v1/channels/add', { server_id: props.server.server_id, channel_name: newChannelName })
      .then((res) => {
        setChannels(prev => [...prev, res.data.channel])
        props.setSelectedChannel(res.data.channel)
        socket.emit("created_channel", props.server.server_id, res.data.channel)
      })
      .catch((error) => { console.log(error) })
    console.log("Adding Channel!")
  }

  const inputRef = useRef();
  return (
    <div className='flex flex-shrink-0 flex-col w-[150px] md:w-[200px] lg:w-[235px] h-screen bg-[#2a2d31] overflow-y-scroll scrollbar-hide'>
      {!sidebarLoading && props.server !== null &&
        <>
          <div className='flex justify-between items-center w-full py-[11.5px] px-4 border-b border-black mb-5'>
            <span className='max-w-[80%] h-fit truncate text-md'>{props.server.server_name}</span>
            <div className='h-5 w-5 bg-red-800'></div>
          </div>
          <div className='flex items-center justify-between text-sm text-neutral-400 mx-3 my-1'>
            <span>Channels:</span>
            <span
              className='relative text-xl hover:text-white cursor-pointer'
              onClick={() => {
                setAddingChannel(true)
                setTimeout(() => { inputRef.current.focus() }, 100);
              }}
            >
              +
            </span>
          </div>
          {channels.filter(channel => channel.in_server === props.server.server_id).map(channel => (
            <div
              key={`ch:${channel.channel_id}`}
              className={`flex w-[90%] mx-auto ${(props.selectedChannel.channel_id === channel.channel_id) ? 'bg-[#404248] text-white' : 'hover:bg-[#36383c] hover:text-white'} text-sm text-neutral-400 p-2 rounded-lg cursor-pointer mb-1.5`}
              onClick={() => {
                if (props.selectedChannel.channel_id !== channel.channel_id) {
                  setMsgLoading(true)
                  props.setSelectedChannel(channel)
                }
              }}
            >
              <PiDiamondsFourDuotone className='h-5 w-5 mr-1.5' />
              <span>{channel.channel_name}</span>
            </div>
          ))}
          <div
            className={`flex ${addingChannel ? 'block' : 'hidden'} w-[90%] mx-auto bg-[#404248] text-white text-sm overflow-x-scroll scrollbar-hide p-2 rounded-lg`}
          >
            <PiDiamondsFourDuotone className='h-5 w-5 mr-1.5' />
            <input
              className='bg-transparent w-[85%] outline-none'
              value={newChannelName}
              onBlurCapture={(e) => { handleAddChannel(e) }}
              onChange={(e) => {
                if (e.target.value.length < 30) setNewChannelName(e.target.value)
              }}
              onKeyDownCapture={(e) => { 
                e.key === "Enter" && inputRef.current.blur()
              }}
              ref={inputRef}
            >

            </input>
          </div>
        </>
      }
    </div>
  )
}

export default ChannelListContainer