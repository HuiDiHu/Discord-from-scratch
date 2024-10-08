import React, { useContext, useState } from 'react'
import { AccountContext } from 'src/components/auth/UserContext'
import { IoMdSettings } from "react-icons/io";
import ImportProfilePictureModal from './channels/servers/ImportProfilePictureModal';

const TinyUserProfileContainer = () => {

    const [importProfilePictureModalOpen, setImportProfilePictureModalOpen] = useState(false);
    const { user } = useContext(AccountContext)

    return (
        <>
            <div className='absolute bottom-0 h-14 w-full bg-neutral-900 bg-opacity-70 flex justify-between pt-2 px-2'>
                <div className='flex max-w-40'>
                    <div className='relative h-9 w-9 flex-shrink-0'>
                        <img
                            src={user.profile || `../../../../assets/tempIcons/GRAGAS.png`}
                            className='h-full w-full [clip-path:circle(45%_at_50%_50%)]'
                        />
                        <div
                            className={`absolute h-3 w-3 rounded-lg border-2 border-[#2a2d31] bg-green-500 transition-all duration-300 ease-in-out bottom-0.5 right-0.5`}
                        />
                    </div>
                    <span className={`text-white text-sm ml-2 truncate mt-1`}>{user.username}</span>
                </div>
                <div className='mt-1.5 h-8 w-8 flex justify-center items-center rounded-sm hover:bg-neutral-700 mr-1 cursor-pointer'>
                    <IoMdSettings
                        className='h-6 w-6 mb-0.5 text-neutral-300 hover:text-white'
                        onClick={() => { setImportProfilePictureModalOpen(true) }}
                    />
                </div>
            </div>
            {importProfilePictureModalOpen &&
                <ImportProfilePictureModal
                    ID={user.userid}
                    setImportProfilePictureModalOpen={setImportProfilePictureModalOpen}
                    uploadTo={'USERS'}
                    profilePicture={user.profile}
                />
            }
        </>
    )
}

export default TinyUserProfileContainer