import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { LoadingContext, ServerContext, MemberContext } from 'src/pages/Channels'
import ChannelListContainer from 'src/components/channels/servers/ChannelListContainer'
import Channel from 'src/components/channels/Channel'
import ChannelSkeleton from 'src/components/skeleton/ChannelSkeleton'
import base64ToURL from 'src/base64ToURL'
import { AccountContext } from 'src/components/auth/UserContext'

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

const Server = () => {
  const { id: server_id } = useParams();
  const { sidebarLoading, setSidebarLoading, membersLoading, setMembersLoading } = useContext(LoadingContext);
  const { channels, serverList, loadedServers, setLoadedServers, setChannels } = useContext(ServerContext);
  const { memberList, setMemberList } = useContext(MemberContext)
  const { user } = useContext(AccountContext)

  const [serverOptionsOpen, setServerOptionsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState({ channel_id: null })
  const [server, setServer] = useState(null);
  const [skeletonSeed, setSkeletonSeed] = useState("default")

  const freeAndAllocateMembersProfilePicture = (newMemberList) => {
    memberList.forEach(item => {
      if (item.profile) URL.revokeObjectURL(item.profile);
    })
    return newMemberList.map(member => {
      if (member.profile) member.profile = base64ToURL(member.profile);
      return member;
    })
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (membersLoading && serverList !== null) {
      if (!sidebarLoading) {
        axios
          .create({
            baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
          })
          .get(`/api/v1/servers/members/${server_id}`)
          .then((res) => {
            res.data.members = freeAndAllocateMembersProfilePicture(res.data.members);
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
            baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
            headers: {
              'Authorization': `Bearer ${user.token}`
            }
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

            res.data.members = freeAndAllocateMembersProfilePicture(res.data.members);
            setMemberList([...res.data.members]);

            setLoadedServers(prev => [Number(server_id), ...prev]);
            setTimeout(() => { setSidebarLoading(false); }, 300)
            setMembersLoading(false);
          })
          .catch((error) => {
            console.log(error)
            setSidebarLoading(false);
            setMembersLoading(false);
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
    setSkeletonSeed(generateRandomString(100))
    if (server !== null && server.server_id === Number(server_id)) return;
    setServerOptionsOpen(false);
    setMembersLoading(true);
    if (loadedServers.indexOf(Number(server_id)) !== -1) {
      setLoadedServers(prev => [Number(server_id), ...prev.filter(item => item !== Number(server_id))])
      setSelectedChannel(channels.find(item => item.in_server === Number(server_id)) || {});
      setSidebarLoading(false);
      //console.log("SERVER ALREADY LOADED!")
    } else {
      setSidebarLoading(true);
      //console.log("LOADING SERVER")
    }
  }, [server_id])

  useEffect(() => {
    if (serverList !== null) {
      setServer(serverList.find(item => item.server_id === Number(server_id)))
    }
  }, [serverList !== null, server_id])

  return (
    <div className='flex w-full h-full'>
      <ChannelListContainer props={{ server, selectedChannel, setSelectedChannel, serverOptionsOpen, setServerOptionsOpen }} />
      {!membersLoading && selectedChannel.channel_id !== null ?
        <Channel props={{
          channelId: selectedChannel.channel_id,
          channel_name: selectedChannel.channel_name,
          channelType: "channel",
          skeletonSeed
        }} /> :
        <ChannelSkeleton skeletonSeed={skeletonSeed} channelType={'channel'} />
      }
    </div>
  )
}

export default Server