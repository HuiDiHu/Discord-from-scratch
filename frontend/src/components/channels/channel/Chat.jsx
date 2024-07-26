import React, { useContext } from 'react'
import { MessagesContext } from 'src/pages/Channels'
import { AccountContext } from 'src/components/auth/UserContext'

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

const Chat = ({ props }) => {
    const { messages } = useContext(MessagesContext)
    const { user } = useContext(AccountContext)
    return (
        <div className='w-full grow flex flex-col justify-end overflow-y-scroll'>
            {
                messages.filter(message => {
                    if (props.channelType === 'dm') {
                        return message.in_dm === props.channelId
                    } else if (props.channelType === 'channel') {
                        return message.in_channel === props.channelId
                    }
                    return false;
                })
                    .map((message, index, array) => (
                        <div
                            key={props.channelType === 'dm' ? `dm.${message.in_dm}.${index}` :
                                (props.channelType === 'channel' ? `ch.${message.in_channel}.${index}` : '')}
                            className='text-wrap w-full flex'
                        >
                            {(index === 0 || array[index - 1].posted_by !== message.posted_by) ? 
                                <span>{`@${message.posted_by}:`}</span> : <span>{"----------------------------------------"}</span>}
                            {message.content}
                            
                        </div>
                    ))
            }
        </div>
    )
}

export default Chat