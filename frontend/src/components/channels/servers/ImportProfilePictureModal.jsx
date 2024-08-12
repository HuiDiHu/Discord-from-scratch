import React, { useContext, useState } from "react";
import axios from "axios";
import { ServerContext, MemberContext, MessagesContext, SocketContext } from "src/pages/Channels";
import { AccountContext } from 'src/components/auth/UserContext'

const ImportProfilePictureModal = ({ ID, setImportProfilePictureModalOpen, uploadTo, profilePicture, server_icon }) => {
    const { setServerList } = useContext(ServerContext)
    const { setSessionTempLinks } = useContext(MemberContext)
    const { user, setUser } = useContext(AccountContext)
    const { setUsersLoaded } = useContext(MessagesContext)
    const { socket } = useContext(SocketContext)
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [errMsg, setErrMsg] = useState("")

    const handleUploadImage = () => {
        if (selectedImage === null || selectedImage === undefined) {
            setErrMsg("No changes were made.")
            return;
        }
        if (uploadTo === 'SERVERS') {
            const server_id = Number(ID);
            const formData = new FormData();
            formData.append('image', selectedImage);
            axios
                .create({
                    baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    },
                    responseType: 'arraybuffer'
                })
                .put(`/api/v1/servers/icon/upload/${ID}`, formData)
                .then(async (res) => {
                    //send websocket request
                    const tempBlobURL = URL.createObjectURL(new Blob([res.data], { type: 'image/png' }));
                    setSessionTempLinks(prev => [tempBlobURL, ...prev]);

                    setServerList(prev => prev.map(item => {
                        if (item.server_id === Number(ID)) item.server_icon = tempBlobURL;
                        return item;
                    }))
                    socket.emit('update_server_icon', Number(ID), res.data);
                    setImportProfilePictureModalOpen(false)
                })
                .catch((error) => {
                    setErrMsg(error.response.data.msg)
                    console.log(error)
                })
            //change profile of server <ID> to selectedImage
            //send a socket request to update all members this new server profile (done in UseSocketSetup probably)

        } else if (uploadTo === 'USERS') {
            const formData = new FormData();
            formData.append('image', selectedImage);
            axios
                .create({
                    baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    },
                    responseType: 'arraybuffer'
                })
                .put(`/api/v1/user/profilePicture/upload/${ID}`, formData)
                .then((res) => {
                    const tempBlobURL = URL.createObjectURL(new Blob([res.data], { type: 'image/png' }));
                    setSessionTempLinks(prev => [tempBlobURL, ...prev]);
                    setUser(prev => ({
                        ...prev,
                        profile: tempBlobURL
                    }))
                    setUsersLoaded(prev => prev.map(item => {
                        if (item.userid === ID) item.profile = tempBlobURL;
                        return item;
                    }))
                    setImportProfilePictureModalOpen(false)
                })
                .catch((error) => {
                    setErrMsg(error.response.data.msg)
                    console.log(error)
                })
        } else {
            console.log('INVALID LOCATION TO UPLOAD IMAGE')
            setImportProfilePictureModalOpen(false)
        }
    }
    //console.log(uploadTo, profilePicture, server_icon)
    return (
        <div
            className='h-screen w-screen overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={() => { setImportProfilePictureModalOpen(false) }}
        >
            <div
                className='relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%] h-[400px] bg-[#31313c] rounded-3xl flex flex-col py-5 px-10'
                onClick={(e) => e.stopPropagation()}
            >
                <span className="text-3xl mx-auto mb-4">Upload {uploadTo === 'SERVERS' ? 'Server Icon' : 'Profile Picture'}</span>
                <br />
                <div className="flex flex-col ml-[29%]">
                    {!selectedImage && (
                        <div className="ml-16 p-1 rounded-full border-[3px] border-dashed w-fit">
                            <div className='relative h-28 w-28'>
                                <img
                                    src={(uploadTo === 'USERS' ? profilePicture : server_icon) || '../../../../assets/tempIcons/GRAGAS.png'}
                                    alt="not found"
                                    className='h-full w-full [clip-path:circle(45%_at_50%_50%)]'
                                />
                            </div>
                        </div>
                    )}

                    {/* Conditionally render the selected image if it exists */}
                    {selectedImage && (
                        <div className="ml-16 p-1 rounded-full border-[3px] border-dashed w-fit">
                            <div className='relative h-28 w-28'>
                                {/* Display the selected image */}
                                <img
                                    src={URL.createObjectURL(selectedImage)}
                                    alt="not found"
                                    className='h-full w-full [clip-path:circle(45%_at_50%_50%)]'
                                />
                            </div>
                        </div>
                    )}

                    <br /> <br />

                    {/* Input element to select an image file */}
                    <input
                        type="file"
                        accept="image/png"
                        name="image"
                        // Event handler to capture file selection and update the state
                        onChange={(event) => {
                            if (!event.target.files[0].name.match(/\.(png)$/i)) {
                                setErrMsg("You cannot upload a file that isn't an image")
                            } else {
                                setSelectedImage(event.target.files[0]); // Update the state with the selected file
                                setErrMsg("")
                            }
                        }}
                    />
                    <div className="h-8 w-fit mb-3">
                        <span className="text-red-600 text-xs">{errMsg}</span>
                    </div>
                </div>
                <div className="flex space-x-10 mx-auto">
                    <button
                        className="group/reset px-4 py-1.5"
                        onClick={() => { setImportProfilePictureModalOpen(false) }}
                    >
                        <span className="text-md group-hover/reset:underline">Reset</span>
                    </button>
                    <button
                        className="group/confirm px-4 py-1.5 bg-green-500 hover:bg-green-600 rounded-sm"
                        onClick={handleUploadImage}
                    >
                        <span className="text-md">Confirm</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ImportProfilePictureModal