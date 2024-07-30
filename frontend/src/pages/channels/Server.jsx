import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingContext, ServerContext, MemberContext } from 'src/pages/Channels'
import ChannelListContainer from 'src/components/channels/servers/ChannelListContainer'
import Channel from 'src/components/channels/Channel'

const Server = () => {
  const { id: server_id } = useParams();
  const { msgLoading, setMsgLoading, setSidebarLoading } = useContext(LoadingContext);
  const { channels, serverList, loadedServers, setLoadedServers, setChannels } = useContext(ServerContext);
  const { setMemberList, memberList } = useContext(MemberContext)

  const [selectedChannel, setSelectedChannel] = useState({ channel_id: null })
  const [server, setServer] = useState(null);

  const navigate = useNavigate();
  useLayoutEffect(() => {
    if (server_id === null) return;
    if (server !== null && server.server_id === Number(server_id)) return;
    console.log("HAIAHI")
    if (loadedServers.indexOf(Number(server_id)) !== -1) {
      setSelectedChannel(channels.find(item => item.in_server === Number(server_id)) || {});
      setSidebarLoading(false);
      console.log("SERVER ALREADY LOADED!")
      axios
        .create({
          baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
          withCredentials: true
        })
        .get(`/api/v1/servers/members/${server_id}`)
        .then((res) => {
          setMemberList(res.data.members)
          return;
        })
        .catch((error) => {
          console.log(error)
          navigate('/channels/@me')
          return;
        })
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
        setSelectedChannel(res.data.channelList[0]);
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

  useEffect(() => {
    if (serverList !== null) {
      setServer(serverList.find(item => item.server_id === Number(server_id)))
    }
  }, [serverList, server_id])

  return (
    <div className='flex w-full h-full'>
      <ChannelListContainer props={{ server, selectedChannel, setSelectedChannel }} />
      {!msgLoading && memberList.length > 0 && selectedChannel.channel_id !== null ?
        <Channel props={{
          channelId: selectedChannel.channel_id,
          channel_name: selectedChannel.channel_name,
          channelType: "channel"
        }} /> :
        <div className='grow text-center text-red-800 text-3xl'>
          {/*console.log(msgLoading, memberList.length, selectedChannel.channel_id)*/}
          LOADING...
        </div>
      }
    </div>
  )
}

export default Server