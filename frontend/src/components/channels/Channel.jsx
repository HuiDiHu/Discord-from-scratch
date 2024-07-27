import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'

const Channel = ({ props }) => {
    return (
        <div className='flex flex-col h-full grow bg-gradient-to-r from-[#303338] to-[#313167]'>
            <ChannelHeader props={{
                channelName: props.channelName,
                channelType: props.channelType,
                friend: props.friend
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