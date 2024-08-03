import { useContext } from 'react'
import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'
import MemberListContainer from './servers/MemberListContainer'
import { LoadingContext, MemberContext } from 'src/pages/Channels'

const Channel = ({ props }) => {
    const { membersLoading } = useContext(LoadingContext)
    const { memberListOpen } = useContext(MemberContext)
    return (
        <div className='flex flex-col h-full grow bg-gradient-to-r from-[#303338] to-[#313167]'>
            <>
                <ChannelHeader props={{
                    channel_name: props.channel_name,
                    channelType: props.channelType,
                    friend: props.friend
                }} />
                <div className='flex h-full'>
                    <div className='flex flex-col h-full grow'>
                        <Chat props={{
                            channelId: props.channelId,
                            channelType: props.channelType
                        }} />
                        <ChatBox props={{
                            channelId: props.channelId,
                            channel_name: props.channel_name,
                            channelType: props.channelType
                        }} />
                    </div>
                    {!membersLoading && memberListOpen && props.channelType === 'channel' && <MemberListContainer />}
                </div>
            </>
        </div>
    )
}

export default Channel