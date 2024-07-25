import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'

const Channel = ({ props }) => {
    return (
        <div className='flex flex-col h-full grow bg-gradient-to-br from-[#203faf] to-[#5c7fd0]'>
            <ChannelHeader props={{
                channelName: props.channelName
            }} />
            <Chat props={{
                channelId: props.channelId,
                channelType: props.channelType
            }} />
            <ChatBox props={{
                channelId: props.channelId,
                channelName: props.channelName,
                channelType: props.channelType
            }} />
        </div>
    )
}

export default Channel