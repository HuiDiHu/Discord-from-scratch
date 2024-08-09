import React, { useContext, useRef, useState } from 'react'
import { MessagesContext, LoadingContext } from 'src/pages/Channels'
import MessageContainer from './MessageContainer'
import HeaderMessageContainer from './HeaderMessageContainer';
import { AccountContext } from 'src/components/auth/UserContext'
import socket from 'src/socket'


const FIVE_MIN = 5 * 60 * 1000;

const Chat = ({ props }) => {
    const { messages, setMessages, usersLoaded} = useContext(MessagesContext)
    const { user } = useContext(AccountContext)
    const [hoveredMessage, setHoveredMessage] = useState(null)
    const handleDeleteMessage = (message_id, in_dm, in_channel, posted_by) => {
        if (posted_by !== user.userid) {
            alert('You can only delete your own messages!')
            return;
        }
        if (props.channelType === 'dm') {
            setMessages(
                messages.filter(
                    item => !(item.message_id === message_id && item.in_dm === props.channelId)
                )
            )
        } else if (props.channelType === 'channel') {
            setMessages(
                messages.filter(
                    item => !(item.message_id === message_id && item.in_channel === props.channelId)
                )
            )
        }
        socket.emit("delete_message", message_id, in_dm, in_channel)
    }

    return (
        <div className='w-full grow flex flex-col justify-end overflow-y-scroll pr-3'>
            <div className='h-64 w-full flex-shrink-0' />
            {messages.filter(message => {
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
                                key={props.channelType === 'dm' ? `dm.${message.message_id}` :
                                    (props.channelType === 'channel' ? `ch.${message.message_id}` : index)}
                                props={{
                                    message,
                                    author: usersLoaded.find(item => item.userid === message.posted_by),
                                    by_user: message.posted_by === user.userid,
                                    hoveredMessage, setHoveredMessage,
                                    handleDeleteMessage, index,
                                    psudoId: props.channelType === 'dm' ? `dm.${message.message_id}` : (props.channelType === 'channel' ? `ch.${message.message_id}` : index)
                                }}
                            /> :
                            <MessageContainer
                                key={props.channelType === 'dm' ? `dm.${message.message_id}` :
                                    (props.channelType === 'channel' ? `ch.${message.message_id}` : index)}
                                props={{
                                    message,
                                    by_user: message.posted_by === user.userid,
                                    hoveredMessage, setHoveredMessage,
                                    handleDeleteMessage, index,
                                    psudoId: props.channelType === 'dm' ? `dm.${message.message_id}` : (props.channelType === 'channel' ? `ch.${message.message_id}` : index)
                                }}
                            />
                    ))
            }
            <br />
        </div>
    )
}

export default Chat