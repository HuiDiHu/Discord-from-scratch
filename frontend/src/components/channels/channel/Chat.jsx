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
        <div className='w-auto grow flex flex-col justify-end overflow-y-scroll'>
            {messages
                .filter(message => {
                    if (props.channelType === 'dm') {
                        return message.in_dm === props.channelId
                    } else if (props.channelType === 'channel') {
                        return message.in_channel === props.channelId
                    }
                    return false;
                })
                .map((message, index) => (
                    <span
                        key={props.channelType === 'dm' ? `dm.${message.in_dm}.${index}` : 
                            (props.channelType === 'channel' ? `ch.${message.in_channel}.${index}` : '')}
                        className='text-wrap'
                    >
                        {message.content}
                    </span>
                ))
            }
        </div>
    )
}

export default Chat