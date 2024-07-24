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
                .filter(message => (message.from.channel === props.channelId || message.from.channel === user.userid))
                .map((message, index) => (
                    <span
                        key={`${message.from.channel}.${index}`}
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