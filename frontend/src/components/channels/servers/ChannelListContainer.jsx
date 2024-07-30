import React, { useContext, useLayoutEffect } from 'react'
import { ServerContext, LoadingContext } from 'src/pages/Channels'

const ChannelListContainer = ({ props }) => {
  const { channels, loadedChannels, setLoadedChannels } = useContext(ServerContext)
  const { sidebarLoading, setMsgLoading } = useContext(LoadingContext)

  useLayoutEffect(() => {
    setMsgLoading(true);
    if (channels.length === 0 || props.selectedChannel.channel_id === null) return;
    if (loadedChannels.find(item => item === props.selectedChannel.channel_id)) {
      setMsgLoading(false);
      return;
    }
    console.log("Selected Channel:", props.selectedChannel.channel_id)
    //load messages

    setLoadedChannels(prev => [props.selectedChannel.channel_id, ...prev]);
    setMsgLoading(false); //after querying messages successfully
  }, [channels, props.selectedChannel.channel_id])
  return (
    <div className='flex flex-col min-w-[150px] md:min-w-[200px] lg:min-w-[235px] h-screen bg-[#2a2d31] overflow-y-scroll scrollbar-hide'>
      {!sidebarLoading && props.server !== null &&
        <>
          <div className='flex justify-between items-center w-full py-3 px-4 border-b border-black mb-5'>
            <span className='max-w-[80%] h-fit truncate text-md'>{props.server.server_name}</span>
            <div className='h-5 w-5 bg-red-800'></div>
          </div>
          {channels.filter(channel => channel.in_server === props.server.server_id).map(channel => (
            <div
              key={`ch:${channel.channel_id}`}
              className={`w-[90%] mx-auto ${(props.selectedChannel.channel_id === channel.channel_id) ? 'bg-[#404248] text-white' : 'hover:bg-[#36383c] hover:text-white'} text-neutral-400 p-2 rounded-lg cursor-pointer`}
              onClick={() => {
                if (props.selectedChannel.channel_id !== channel.channel_id) {
                  setMsgLoading(true)
                  props.setSelectedChannel(channel)
                }
              }}
            >
              {channel.channel_name}
            </div>
          ))}
        </>
      }
    </div>
  )
}

export default ChannelListContainer