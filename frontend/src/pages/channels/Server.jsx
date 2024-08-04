import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingContext, ServerContext, MemberContext } from 'src/pages/Channels'
import ChannelListContainer from 'src/components/channels/servers/ChannelListContainer'
import Channel from 'src/components/channels/Channel'

const Server = () => {
  const { id: server_id } = useParams();
  const { sidebarLoading, setSidebarLoading, membersLoading, setMembersLoading } = useContext(LoadingContext);
  const { channels, serverList, loadedServers, setLoadedServers, setChannels } = useContext(ServerContext);
  const { setMemberList } = useContext(MemberContext)

  const [selectedChannel, setSelectedChannel] = useState({ channel_id: null })
  const [server, setServer] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (membersLoading && serverList !== null) {
      if (!sidebarLoading) {
        axios
          .create({
            baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
            withCredentials: true
          })
          .get(`/api/v1/servers/members/${server_id}`)
          .then((res) => {
            setMemberList([...res.data.members]);
            setMembersLoading(false);
            return;
          })
          .catch((error) => {
            console.log(error)
            setMembersLoading(false);
            navigate('/channels/@me')
            return;
          })
      } else {
        axios
          .create({
            baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
            withCredentials: true
          })
          .get(`/api/v1/channels/server/${server_id}`)
          .then((res) => {
            setSelectedChannel(res.data.channelList[0]);
            const uniqueChs = []
            const tempChannelIdList = channels.map(item => item.channel_id);
            res.data.channelList.forEach((ch) => {
              if (tempChannelIdList.indexOf(ch.channel_id) === -1) uniqueChs.push(ch);
            })
            setChannels(prev => [...uniqueChs, ...prev]);
            setMemberList([...res.data.members]);
            setLoadedServers(prev => [Number(server_id), ...prev]);
            setSidebarLoading(false); setMembersLoading(false);
          })
          .catch((error) => {
            console.log(error)
            setSidebarLoading(false); setMembersLoading(false);
            navigate('/channels/@me')
          })
      }
    }
  }, [serverList !== null, membersLoading, sidebarLoading])

  useLayoutEffect(() => {
    if (server_id === null) {
      setSidebarLoading(true); setMembersLoading(true);
      return;
    }
    if (server !== null && server.server_id === Number(server_id)) return;
    setMembersLoading(true);
    if (loadedServers.indexOf(Number(server_id)) !== -1) {
      setLoadedServers(prev => [Number(server_id), ...prev.filter(item => item !== Number(server_id))])
      setSelectedChannel(channels.find(item => item.in_server === Number(server_id)) || {});
      setSidebarLoading(false);
      console.log("SERVER ALREADY LOADED!")
    } else {
      setSidebarLoading(true);
      console.log("LOADING SERVER")
    }
  }, [server_id])

  useEffect(() => {
    if (serverList !== null) {
      setServer(serverList.find(item => item.server_id === Number(server_id)))
    }
  }, [serverList, server_id])

  return (
    <div className='flex w-full h-full'>
      <ChannelListContainer props={{ server, selectedChannel, setSelectedChannel }} />
      {!membersLoading && selectedChannel.channel_id !== null ?
        <Channel props={{
          channelId: selectedChannel.channel_id,
          channel_name: selectedChannel.channel_name,
          channelType: "channel"
        }} /> :
        <div className='grow text-center text-red-800 text-3xl'>LOADING STAGE 1...</div>
      }
    </div>
  )
}

export default Server