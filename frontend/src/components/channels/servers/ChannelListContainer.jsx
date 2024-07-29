import React, { useContext } from 'react'
import { ServerContext, LoadingContext } from 'src/pages/Channels'

const ChannelListContainer = ({ props }) => {
    const { channels, loadedChannels, setLoadedChannels } = useContext(ServerContext)
    const { sidebarLoading } = useContext(LoadingContext)
  return (
    <div className='flex flex-col min-w-[150px] md:min-w-[200px] lg:min-w-[235px] h-screen bg-[#2a2d31] overflow-y-scroll scrollbar-hide'>
        {!sidebarLoading && channels.filter(channel => channel.in_server === props.server_id).map(channel => (
            <span key={`ch:${channel.channel_id}`}>{channel.channel_name}</span>
        ))}
    </div>
  )
}

export default ChannelListContainer