import { useContext, useState } from 'react'
import axios from 'axios' //an alternative to fetch request to send data to database
import { IoMdArrowRoundBack } from "react-icons/io"; //basic arrow icon as an html element
import { useNavigate } from "react-router-dom";
import { AccountContext } from 'src/components/auth/UserContext';
import base64ToURL from '../base64ToURL';

const Signup = () => {
    const { setUser } = useContext(AccountContext)

    //useState() functions from react initialize (email, password, etc) variables with empty strings and update them based on user input
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [emailErrMsg, setEmailErrMsg] = useState("")
    const [passwordErrMsg, setPasswordErrMsg] = useState("")
    const [usernameErrMsg, setUsernameErrMsg] = useState("")

    //used to send the user to different pages
    //called with navigate("route")
    const navigate = useNavigate();

    //activated when enter or continue button is pressed
    const handleSignup = () => {
        if (!email || !password || !username) {
            if (!email) setEmailErrMsg("Email is required!")
            if (!password) setPasswordErrMsg("Password is required!")
            if (!username) setUsernameErrMsg("Username is required!")
            return; //contraints not met
        }
        const emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegix.test(email)) {
            setEmailErrMsg("Email is invalid!")
            return; //constraints not met
        }
        if (email.length < 6 || email.length > 28 || password.length < 6 || password.length > 28 || username.length < 6 || username.length > 28) return; //constraints not met so terminate function before entries are saved
        axios //use axios to save to postgresql database
            .create({
                baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
            })
            .post('/api/v1/auth/register', { email, username, password })
            .then((res) => {
                if (res.data.profile) res.data.profile = base64ToURL(res.data.profile);
                setUser({ ...res.data })
                //console.log("logged in", { ...res.data })
                localStorage.setItem("token", res.data.token);
                navigate('/channels/@me')
            })
            .catch((error) => {
                if (!error.response || !error.response.data || !error.response.data.emailErrMsg) {
                    console.log(error)
                    setEmailErrMsg("An unknown error has occured. Please try again")
                } else {
                    setEmailErrMsg(error.response.data.emailErrMsg)
                }
            })

    }

    return ( //flex-col stacks elements vertically. flex by itself stacks elements horizontally
        <div className='w-full h-[1000px] flex flex-col items-center'>
            <div className='w-[90%] sm:w-[500px] m-auto flex flex-col justify-center bg-[#313167] rounded-[15%] p-8'>
                <h1 className='text-center text-3xl bg-[#98C8DE] p-5 rounded-xl w-1/2 m-auto'> Sign Up</h1>
                <br />
                <>
                    <span className='mb-2 mt-2 text-xl'>Email</span>
                    <div className={`border-2 ${emailErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2 bg-[#5C7Fd0]`}>
                        <input
                            className='bg-transparent text-black w-[90%] outline-none placeholder-black'
                            placeholder='Enter Email'
                            value={email}
                            type='email'
                            onChange={(e) => {
                                setEmail(e.target.value)
                                if (!e.target.value) {
                                    setEmailErrMsg("Email is required!")
                                } else if (e.target.value.length >= 6 && e.target.value.length <= 28) {
                                    setEmailErrMsg("")
                                } else if (e.target.value.length < 6) {
                                    setEmailErrMsg("Email too short!")
                                } else {
                                    setEmailErrMsg("Email too long!")
                                }
                            }}
                            onKeyDown={(e) => { e.key === "Enter" && handleSignup() }}
                        />
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{emailErrMsg}</span>
                    </div>
                </>
                <>
                    <span className='mb-2 mt-2 text-xl'>Username</span>
                    <div className={`border-2 ${usernameErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2 bg-[#5C7Fd0]`}>
                        <input
                            className='bg-transparent text-black w-[90%] outline-none placeholder-black'
                            placeholder='Enter Username'
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                if (!e.target.value) {
                                    setUsernameErrMsg("Username is required!")
                                } else if (e.target.value.length >= 6 && e.target.value.length <= 28) {
                                    setUsernameErrMsg("")
                                } else if (e.target.value.length < 6) {
                                    setUsernameErrMsg("Username too short!")
                                } else {
                                    setUsernameErrMsg("Username too long!")
                                }
                            }}
                            onKeyDown={(e) => { e.key === "Enter" && handleSignup() }}
                        />
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{usernameErrMsg}</span>
                    </div>
                </>
                <>
                    <span className='mb-2 mt-2 text-xl'>Password</span>
                    <div className={`border-2 ${passwordErrMsg ? 'border-red-600' : 'border-gray-400 focus-within:border-sky-500'} rounded-lg pl-4 py-2 bg-[#5C7Fd0]`}>
                        <input
                            className='bg-transparent text-black w-[90%] outline-none placeholder-black'
                            placeholder='Enter Password'
                            value={password}
                            type='password'
                            onChange={(e) => {
                                setPassword(e.target.value)
                                if (!e.target.value) {
                                    setPasswordErrMsg("Password is required!")
                                } else if (e.target.value.length >= 6 && e.target.value.length <= 28) {
                                    setPasswordErrMsg("")
                                } else if (e.target.value.length < 6) {
                                    setPasswordErrMsg("Password too short!")
                                } else {
                                    setPasswordErrMsg("Password too long!")
                                }
                            }}
                            onKeyDown={(e) => { e.key === "Enter" && handleSignup() }}
                        />
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{passwordErrMsg}</span>
                    </div>
                </>
                <div className='flex space-x-5'>
                    <button
                        className='bg-[#203FAF] rounded-xl py-4 mb-5 text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 mt-5 w-1/2 mx-auto'
                        onClick={handleSignup}
                    >
                        Continue
                    </button>
                    <button
                        className='bg-[#203FAF] rounded-xl py-4 mb-5 text-white content-center hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 mt-5 w-1/2 mx-auto flex justify-center items-center'
                        onClick={() => { navigate("/login"); }}
                    >
                        <IoMdArrowRoundBack className='mr-1' />
                        Back
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Signup
