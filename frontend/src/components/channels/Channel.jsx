import { useContext, useEffect, useLayoutEffect } from 'react'
import axios from 'axios'
import ChannelHeader from './channel/ChannelHeader'
import Chat from './channel/Chat'
import ChatBox from './channel/ChatBox'
import MemberListContainer from './servers/MemberListContainer'
import ChannelSkeleton from '../skeleton/ChannelSkeleton'
import { LoadingContext, MessagesContext, MemberContext, ServerContext } from 'src/pages/Channels'
import { AccountContext } from 'src/components/auth/UserContext'
import { useNavigate } from 'react-router-dom'
import base64ToURL from 'src/base64ToURL'

const Channel = ({ props }) => {
    const { msgLoading, setMsgLoading, membersLoading } = useContext(LoadingContext)
    const { memberListOpen, setSessionTempLinks } = useContext(MemberContext)
    const { loadedChannels, setLoadedChannels } = useContext(ServerContext)
    const { messages, setMessages, loadedDMs, setLoadedDMs, usersLoaded, setUsersLoaded } = useContext(MessagesContext)
    const { user } = useContext(AccountContext)

    const navigate = useNavigate();
    //remember to modify usersLoaded when ever someone sends an message

    //this will only be called for server channels
    const loadNewMessageUserIds = (newMessages) => {
        const tempUserIds = new Set(usersLoaded.map(item => item.userid));
        const newUserIds = [... new Set(newMessages.map(item => item.posted_by).filter(uuid => !tempUserIds.has(uuid)))]
        loadNewMessageUsers(newUserIds)
    }

    const loadNewMessageUsers = (newUserIds) => {
        if (newUserIds.length === 0) {
            setTimeout(() => { setMsgLoading(false); }, 500)
            return;
        }
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                withCredentials: true
            })
            .post('/api/v1/user/multiple', { useridList: newUserIds })
            .then((res) => {
                const tempBlobURLs = [];
                for (let i = 0; i < res.data.length; ++i) {
                    if (res.data[i].profile) {
                        res.data[i].profile = base64ToURL(res.data[i].profile);
                        tempBlobURLs.push(res.data[i].profile)
                    }
                }
                setSessionTempLinks(prev => [...tempBlobURLs, ...prev])
                setUsersLoaded(prev => [...res.data, ...prev])
                setTimeout(() => { setMsgLoading(false) }, 750);
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
                        if (usersLoaded.findIndex(item => item.userid === user.userid) === -1) {
                            /*if (!user.profile.startsWith("blob:")) {
                                console.log("NOT BLOB: user")
                                user.profile = base64ToURL(user.profile);
                            }*/
                            setUsersLoaded(prev => [user, ...prev]);
                        }
                        if (usersLoaded.findIndex(item => item.userid === props.friend.userid) === -1) {
                            setUsersLoaded(prev => [props.friend, ...prev]);
                        }
                        setTimeout(() => { setMsgLoading(false); }, 750);
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
                        loadNewMessageUserIds(uniqueMsgs);
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
                <ChannelSkeleton skeletonSeed={props.skeletonSeed} channelType={props.channelType} />
            }
        </>
    )
}

export default Channel