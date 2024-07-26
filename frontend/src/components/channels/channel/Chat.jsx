import React, { useContext } from 'react'
import { MessagesContext, MemberContext } from 'src/pages/Channels'
import MessageContainer from './MessageContainer'
import HeaderMessageContainer from './HeaderMessageContainer';
/*
message = {
    from: {
        user: ,
        channel: 
    },
    content: ,
    createdAt: 
}
*/

/*
(index === 0 || array[index - 1].posted_by !== message.posted_by) 
*/
const FIVE_MIN = 5 * 60 * 1000;

const Chat = ({ props }) => {
    const { messages, msgLoading } = useContext(MessagesContext)
    const { memberList } = useContext(MemberContext)
    return (
        <div className='w-full grow flex flex-col justify-end overflow-y-scroll pr-3'>
            {msgLoading ? <div> LOADING </div> :
                messages.filter(message => {
                    if (props.channelType === 'dm') {
                        return message.in_dm === props.channelId
                    } else if (props.channelType === 'channel') {
                        return message.in_channel === props.channelId
                    }
                    return false;
                })
                    .map((message, index, array) => (
                        (index === 0 || array[index - 1].posted_by !== message.posted_by ||
                            (new Date(message.created_at) - new Date(array[index - 1].created_at)) > FIVE_MIN) ?
                            <HeaderMessageContainer
                                key={props.channelType === 'dm' ? `dm.${message.in_dm}.${index}` :
                                    (props.channelType === 'channel' ? `ch.${message.in_channel}.${index}` : '')}
                                props={{
                                    message,
                                    member: memberList.find(item => item.userid === message.posted_by)
                                }}
                            /> :
                            <MessageContainer
                                key={props.channelType === 'dm' ? `dm.${message.in_dm}.${index}` :
                                    (props.channelType === 'channel' ? `ch.${message.in_channel}.${index}` : '')}
                                props={{ message }}
                            />
                    ))
            }
            <br />
        </div>
    )
}

export default Chat