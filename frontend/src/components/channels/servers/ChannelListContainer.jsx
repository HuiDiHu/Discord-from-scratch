import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
import { ServerContext, LoadingContext, SocketContext } from 'src/pages/Channels'
import { AccountContext } from 'src/components/auth/UserContext'
import { PiDiamondsFourDuotone } from "react-icons/pi";
import { MdGroupAdd } from "react-icons/md";
import GenerateTokenModal from './GenerateTokenModal';
import { IoChevronDown } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import LeaveServer from './LeaveServer';
import DeleteServer from './DeleteServer';
import EditServerProfile from './EditServerProfile';
import ImportProfilePictureModal from './ImportProfilePictureModal';
import DeleteServerModal from './DeleteServerModal';
import ChannelListSkeleton from '../../skeleton/ChannelListSkeleton';
import TinyUserProfileContainer from 'src/components/TinyUserProfileContainer';

const ChannelListContainer = ({ props }) => {
  const { channels, setChannels } = useContext(ServerContext)
  const { sidebarLoading } = useContext(LoadingContext)
  const { user } = useContext(AccountContext)
  const { socket } = useContext(SocketContext)

  const [addingChannel, setAddingChannel] = useState(false);
  const [generateTokenModalOpen, setGenerateTokenModalOpen] = useState(false);
  const [importProfilePictureModalOpen, setImportProfilePictureModalOpen] = useState(false);
  const [deleteServerModalOpen, setDeleteServerModal] = useState(false);


  const [newChannelName, setNewChannelName] = useState("");

  const handleAddChannel = (e) => {
    e.stopPropagation();
    setAddingChannel(false);
    if (!newChannelName) return;
    axios
      .create({
        baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .post('/api/v1/channels/add', { server_id: props.server.server_id, channel_name: newChannelName })
      .then((res) => {
        setChannels(prev => [...prev, res.data.channel])
        props.setSelectedChannel(res.data.channel)
        socket.emit("created_channel", props.server.server_id, res.data.channel)
      })
      .catch((error) => {
        alert(`${error.response.data.msg}. Popup to be implemented...`)
        console.log(error)
      })
    //console.log("Adding Channel!")
  }

  const inputRef = useRef();
  return (
    <div className='relative flex flex-shrink-0 flex-col w-[150px] md:w-[200px] lg:w-[235px] h-screen bg-[#2a2d31]'>
      {!sidebarLoading && props.server !== null && props.server !== undefined ?
        <>
          <div className='flex justify-between items-center w-full py-[11.5px] px-4 border-b border-black'>
            <span className='max-w-[80%] h-fit truncate text-md'>{props.server.server_name}</span>
            {props.serverOptionsOpen ?
              <IoClose
                className='h-5 w-5 cursor-pointer text-white'
                onClick={() => { props.setServerOptionsOpen(false); }}
              /> :
              <IoChevronDown
                className='h-5 w-5 cursor-pointer text-white'
                onClick={() => { props.setServerOptionsOpen(true); }}
              />
            }
          </div>
          <div className='relative flex flex-col w-full h-[90%] overflow-y-auto scrollbar-hide pb-10'>
            {props.serverOptionsOpen &&
              <div className='absolute z-10 top-2 mx-[5%] w-[90%] bg-black rounded-md py-2 flex flex-col space-y-0.5'>
                {props.server.server_owner !== user.userid ?
                  <>
                    <LeaveServer server_id={props.server.server_id} setServerOptionsOpen={props.setServerOptionsOpen} />
                  </> :
                  <>
                    <div
                      className='group/invite flex items-center justify-between px-2 py-1.5 w-[92%] mx-auto rounded-sm hover:bg-[#313167ff] cursor-pointer'
                      onClick={() => {
                        setGenerateTokenModalOpen(true)
                        props.setServerOptionsOpen(false);
                      }}
                    >
                      <span className='text-sm text-neutral-400 group-hover/invite:text-white'>Invite People</span>
                      <MdGroupAdd
                        className='h-[18px] w-[18px] text-neutral-400 group-hover/invite:text-white'
                      />
                    </div>
                    <EditServerProfile setServerOptionsOpen={props.setServerOptionsOpen} setImportProfilePictureModalOpen={setImportProfilePictureModalOpen} />
                    <span className='w-[90%] mx-auto border border-neutral-700'></span>
                    <DeleteServer setServerOptionsOpen={props.setServerOptionsOpen} setDeleteServerModal={setDeleteServerModal} />
                  </>
                }
              </div>
            }
            <br />
            <div className='flex items-center justify-between text-sm text-neutral-400 mx-3 my-1'>
              <span>Channels:</span>
              <span
                className='relative text-xl hover:text-white cursor-pointer'
                onClick={() => {
                  setAddingChannel(true)
                  setTimeout(() => { inputRef.current.focus() }, 100);
                }}
              >
                +
              </span>
            </div>
            {channels.filter(channel => channel.in_server === props.server.server_id).map(channel => (
              <div
                key={`ch:${channel.channel_id}`}
                className={`flex w-[90%] mx-auto ${(props.selectedChannel.channel_id === channel.channel_id) ? 'bg-[#404248] text-white' : 'hover:bg-[#36383c] hover:text-white'} text-sm text-neutral-400 p-2 rounded-lg cursor-pointer mb-1.5`}
                onClick={() => {
                  if (props.selectedChannel.channel_id !== channel.channel_id) {
                    props.setSelectedChannel(channel)
                  }
                }}
              >
                <PiDiamondsFourDuotone className='h-5 w-5 mr-1.5' />
                <span>{channel.channel_name}</span>
              </div>
            ))}
            <div
              key={"add_channel"}
              className={`flex flex-shrink-0 ${addingChannel ? 'block' : 'hidden'} w-[90%] mx-auto bg-[#404248] text-white text-sm overflow-x-scroll scrollbar-hide p-2 rounded-lg`}
            >
              <PiDiamondsFourDuotone className='h-5 w-5 mr-1.5' />
              <input
                className='bg-transparent w-[85%] outline-none'
                value={newChannelName}
                onBlurCapture={(e) => { handleAddChannel(e) }}
                onChange={(e) => {
                  if (e.target.value.length < 30) setNewChannelName(e.target.value)
                }}
                onKeyDownCapture={(e) => {
                  e.key === "Enter" && inputRef.current.blur()
                }}
                ref={inputRef}
              />
            </div>
          </div>
          <TinyUserProfileContainer />
          {importProfilePictureModalOpen && <ImportProfilePictureModal ID={props.server.server_id} setImportProfilePictureModalOpen={setImportProfilePictureModalOpen} uploadTo={"SERVERS"} profilePicture={user.profilePicture} server_icon={props.server.server_icon} />}
          {deleteServerModalOpen && <DeleteServerModal setDeleteServerModal={setDeleteServerModal} server_id={props.server.server_id} server_name={props.server.server_name} />}
          {generateTokenModalOpen && <GenerateTokenModal props={{ setGenerateTokenModalOpen }} />}
        </> :
        <ChannelListSkeleton />
      }
    </div>
  )
}

export default ChannelListContainer