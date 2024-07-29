import React, { useContext, useLayoutEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingContext, ServerContext, MemberContext } from 'src/pages/Channels'
import ChannelListContainer from 'src/components/channels/servers/ChannelListContainer'
import Channel from 'src/components/channels/Channel'

const Server = () => {
  const { id: server_id } = useParams();
  const { setMsgLoading, setSidebarLoading } = useContext(LoadingContext);
  const { loadedServers, setLoadedServers, setChannels } = useContext(ServerContext);
  const { setMemberList } = useContext(MemberContext)

  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (loadedServers.indexOf(Number(server_id)) !== -1) {
      setSidebarLoading(false);
      console.log("SERVER ALREADY LOADED!")
      return;
    }
    setSidebarLoading(true); setMsgLoading(true);
    axios
      .create({
        baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
        withCredentials: true
      })
      .get(`/api/v1/channels/server/${server_id}`)
      .then((res) => {
        console.log("LOADING SERVER")
        setChannels(prev => [...res.data.channelList, ...prev]);
        setMemberList([...res.data.members]);
        setLoadedServers(prev => [...prev, Number(server_id)]);
        setSidebarLoading(false);
      })
      .catch((error) => {
        console.log(error)
        navigate('/channels/@me')
      })
  }, [server_id])

  return (
    <div className='flex w-full h-full'>
      <ChannelListContainer props={{ server_id: Number(server_id) }} />
    </div>
  )
}

export default Server