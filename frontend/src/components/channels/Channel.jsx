import { LoadingContext } from 'src/pages/Channels'
import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'
import { useContext } from 'react'

const Channel = ({ props }) => {
    const { msgLoading } = useContext(LoadingContext)

    return (
        <div className='flex flex-col h-full grow bg-gradient-to-r from-[#303338] to-[#313167]'>
            {!msgLoading &&
                <>
                    <ChannelHeader props={{
                        channel_name: props.channel_name,
                        channelType: props.channelType,
                        friend: props.friend
                    }} />
                    <Chat props={{
                        channelId: props.channelId,
                        channelType: props.channelType
                    }} />
                    <ChatBox props={{
                        channelId: props.channelId,
                        channel_name: props.channel_name,
                        channelType: props.channelType
                    }} />
                </>
            }
        </div>
    )
}

export default Channel