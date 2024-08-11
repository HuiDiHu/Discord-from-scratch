import React, { useContext, useEffect, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AccountContext } from 'src/components/auth/UserContext';


const GenerateTokenModal = ({ props }) => {
    const { user } = useContext(AccountContext)

    const [token, setToken] = useState("")
    const [errMsg, setErrMsg] = useState("")
    const [copied, setCopied] = useState(false);
    const { id: server_id } = useParams();
    useEffect(() => {
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .get(`/api/v1/servers/token/${server_id}`)
            .then((res) => {
                setToken(res.data.token)
            })
            .catch((error) => {
                console.log(error)
                setErrMsg(error.response.data.msg ? error.response.data.msg : "An unknown error has occurred")
            })
    }, [])
    return (
        <div
            className='h-screen w-screen overflow-clip fixed bg-black bg-opacity-60 top-0 right-0 bottom-0 z-50 flex justify-center items-center'
            onClick={() => { props.setGenerateTokenModalOpen(false) }}
        >
            <div
                className='relative w-[95%] sm:w-[80%] md:w-[60%] lg:w-[45%] h-[200px] bg-[#31313c] rounded-3xl flex flex-col py-5 px-10'
                onClick={(e) => e.stopPropagation()}
            >
                <span className='text-3xl font-medium w-full text-center'>Send a server invite token to a friend!</span>
                <span className='w-full border mt-2 border-neutral-500'/>
                <br />
                <div className='mx-auto flex items-center space-x-8'>
                    <div className={`rounded-lg border-2 ${copied ? 'border-green-500' : 'border-sky-500'} h-20 flex items-center justify-center py-2 px-5 ease-in-out duration-300`}>
                        {token === "" ?
                            (errMsg !== "" ?
                                <span className='text-3xl text-red-600 text-center'>{errMsg}</span> :
                                <span className='text-lg text-neutral-400 animate-pulse'>Generating Token...</span>
                            ) :
                            <span className='text-6xl text-center'>{token}</span>
                        }
                    </div>
                    {token &&
                        <button
                            className='bg-[#203FAF] rounded-xl py-2 text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 px-5 h-14 text-xl'
                            onClick={() => {
                                navigator.clipboard.writeText(token)
                                setCopied(true)
                            }}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    }
                </div>
                <IoMdClose
                    className='absolute top-4 right-4 w-6 h-6 cursor-pointer'
                    onClick={() => { props.setGenerateTokenModalOpen(false) }}
                />
            </div>
        </div>
    )
}

export default GenerateTokenModal