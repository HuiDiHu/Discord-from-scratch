import { useContext, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'
import MemberListContainer from './servers/MemberListContainer'
import { LoadingContext, MessagesContext, MemberContext, ServerContext } from 'src/pages/Channels'
import { useNavigate } from 'react-router-dom'

const Channel = ({ props }) => {
    const { msgLoading, setMsgLoading, membersLoading } = useContext(LoadingContext)
    const { memberListOpen } = useContext(MemberContext)
    const { loadedChannels, setLoadedChannels } = useContext(ServerContext)
    const { messages, setMessages, loadedDMs, setLoadedDMs, usersLoaded, setUsersLoaded } = useContext(MessagesContext)

    const navigate = useNavigate();

    //remember to modify usersLoaded when ever someone sends an message

    //this will only be called for server channels
    const loadNewMessageUsers = (newMessages) => {
        const tempUserIds = new Set(usersLoaded.map(item => item.userid));
        const newUserIds = [... new Set(newMessages.map(item => item.posted_by).filter(uuid => !tempUserIds.has(uuid)))]
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .post('/api/v1/user/multiple', { useridList: newUserIds })
            .then((res) => {
                setUsersLoaded(prev => [...res.data, ...prev])
                setMsgLoading(false);
            })
            .catch((error) => {
                console.log(error)
                navigate('/channels/@me')
            })
    }

    useEffect(() => {
        if (msgLoading) {
            if (props.channelType === 'dm') {
                axios
                    .create({
                        baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                        withCredentials: true
                    })
                    .get(`/api/v1/messages/channels/@me/${props.channelId}`)
                    .then((res) => {
                        setLoadedDMs(prev => [...prev, props.channelId])
                        const uniqueMsgs = []
                        const tempMessages = messages.map(item => item.message_id);
                        res.data.forEach((msg) => {
                            if (tempMessages.indexOf(msg.message_id) === -1) uniqueMsgs.push(msg);
                        })
                        setMessages(prev => [...uniqueMsgs, ...prev])
                        setMsgLoading(false);
                    })
                    .catch((error) => {
                        console.log(error)
                        navigate('/channels/@me')
                    })
            } else if (props.channelType === 'channel') {
                axios
                    .create({
                        baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                        withCredentials: true
                    })
                    .get(`/api/v1/messages/channels/${props.channelId}`)
                    .then((res) => {
                        setLoadedChannels(prev => [props.channelId, ...prev]);
                        const uniqueMsgs = []
                        const tempMessages = messages.map(item => item.message_id);
                        res.data.forEach((msg) => {
                            if (tempMessages.indexOf(msg.message_id) === -1) uniqueMsgs.push(msg);
                        })
                        setMessages(prev => [...uniqueMsgs, ...prev])
                        loadNewMessageUsers(uniqueMsgs);
                    })
                    .catch((error) => {
                        console.log(error)
                        navigate('/channels/@me')
                    })
            }
        }
    }, [msgLoading])

    useLayoutEffect(() => {
        if (props.channelType === 'dm') {
            if (loadedDMs.indexOf(props.channelId) === -1) {
                setMsgLoading(true);
            } else {
                console.log("DM ALREADY LOADED")
            }
        } else if (props.channelType === 'channel') {
            if (loadedChannels.indexOf(props.channelId) === -1) {
                setMsgLoading(true);
            } else {
                console.log("CHANNEL ALREADY LOADED")
            }
        }
    }, [props.channelId, props.channelType])

    //generate loading state here
    return (
        <>
            {!msgLoading ?
                <div className='flex flex-col h-full grow bg-gradient-to-r from-[#303338] to-[#313167]'>
                    <>
                        <ChannelHeader props={{
                            channel_name: props.channel_name,
                            channelType: props.channelType,
                            friend: props.friend
                        }} />
                        <div className='flex h-[calc(100%-3rem)]'>
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
                </div> :
                <div className='grow text-center text-yellow-500 text-3xl'>LOADING STAGE 2...</div>
            }
        </>
    )
}

export default Channel