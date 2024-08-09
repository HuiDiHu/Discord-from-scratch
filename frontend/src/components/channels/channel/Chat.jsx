import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MessagesContext, LoadingContext } from 'src/pages/Channels'
import MessageContainer from './MessageContainer'
import HeaderMessageContainer from './HeaderMessageContainer';
import { AccountContext } from 'src/components/auth/UserContext'
import socket from 'src/socket'


const FIVE_MIN = 5 * 60 * 1000;

const Chat = ({ props }) => {
    const { messages, setMessages, usersLoaded } = useContext(MessagesContext)
    const { user } = useContext(AccountContext)
    const [hoveredMessage, setHoveredMessage] = useState(null)
    const [isAtBottom, setIsAtBottom] = useState(true)

    const chatRef = useRef();
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

    const checkIfAtBottom = () => {
        const container = chatRef.current;
        if (container) {
            const isAtBottom =
                container.scrollHeight - container.scrollTop === container.clientHeight;
            setIsAtBottom(isAtBottom);
        }
    };

    // Scroll to the bottom if the user was at the bottom
    const scrollToBottom = () => {
        const container = chatRef.current;
        if (container && isAtBottom) {
            container.scrollTop = container.scrollHeight;
        }
    };

    useLayoutEffect(() => { setIsAtBottom(true) }, [props.channelType, props.channelId])

    useEffect(() => {
        const container = chatRef.current;
        if (container && isAtBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages, isAtBottom, props.channelType, props.channelId])
    //DO NOT USE flex here. it disables scrolling. i have no idea why
    return (
        <ul
            ref={chatRef} className='grow [overflow-anchor:none] overflow-y-auto pr-3'
            onScrollCapture={checkIfAtBottom}
        >
            <li className='h-[90%] w-auto' />
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
        </ul>
    )
}

export default Chat