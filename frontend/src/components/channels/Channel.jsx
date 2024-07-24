import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'

const Channel = ({ props }) => {

    return (
        <div className='flex flex-col h-full w-full bg-gradient-to-br from-[#203faf] to-[#5c7fd0]'>
            <ChannelHeader />
            <Chat props={{
                channelId: props.channelId
            }} />
            <ChatBox props={{
                channelId: props.channelId,
                members: props.members
            }} />
        </div>
    )
}

export default Channel