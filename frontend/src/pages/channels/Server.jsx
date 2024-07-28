import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingContext, ServerContext, MemberContext } from 'src/pages/Channels'

const Server = () => {
  const { id: server_id } = useParams();
  const { setMsgLoading, setSidebarLoading } = useContext(LoadingContext);
  const { loadedServers, setLoadedServers, setChannels } = useContext(ServerContext);
  const { setMemberList } = useContext(MemberContext)

  useEffect(() => {
    if (loadedServers.indexOf(item => item === server_id) !== -1) return;
    setSidebarLoading(true); setMsgLoading(true);
    

    setChannels(prev => [/*...res.data.channels , */...prev ]); setMemberList([/*...res.data.members*/]); //axios request backend
    setLoadedServers(prev => [...prev, server_id]); setSidebarLoading(false); setMsgLoading(false); //when promise successfully fulfilled
  }, [server_id])

  return (
    <div>
      Server id: {server_id}
    </div>
  )
}

export default Server