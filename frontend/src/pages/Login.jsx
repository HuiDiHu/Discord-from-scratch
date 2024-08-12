import { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { AccountContext } from 'src/components/auth/UserContext';
import base64ToURL from '../base64ToURL';


const Login = () => {
    const { setUser } = useContext(AccountContext)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailErrMsg, setEmailErrMsg] = useState("")
    const [passwordErrMsg, setPasswordErrMsg] = useState("")

    const navigate = useNavigate();
    const handleLogin = () => {
        if (!email || !password) {
            if (!email) setEmailErrMsg("Email is required!")
            if (!password) setPasswordErrMsg("Password is required!")
            return;
        }
        const emailRegix = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegix.test(email)) {
            setEmailErrMsg("Email is invalid!")
            return;
        }
        if (email.length < 6 || email.length > 28 || password.length < 6 || password.length > 28) return;
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV === 'true' ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL,
            })
            .post('/api/v1/auth/login', { email, password })
            .then((res) => {
                if (res.data.profile) res.data.profile = base64ToURL(res.data.profile);
                setUser({ ...res.data })
                //console.log("logged in", { ...res.data })
                localStorage.setItem("token", res.data.token);
                navigate('/channels/@me')
            })
            .catch((error) => {
                if (!error.response || !error.response.data || !error.response.data.emailErrMsg) {
                    setEmailErrMsg("An unknown error has occured. Please try again")
                } else {
                    setEmailErrMsg(error.response.data.emailErrMsg)
                }
                setPasswordErrMsg(" ")
            })

    }

    return ( //p-8 creates padding between the child elements and the parent element. Use [] to import native css values
        <div className='w-full h-[1000px] flex flex-col items-center'>
            <div className='w-[90%] sm:w-[500px] m-auto flex flex-col justify-center bg-[#313167] rounded-[15%] p-8'>
                <h1 className='text-center text-3xl p-4 bg-[#98C8DE] w-1/2 m-auto rounded-xl'> Log In</h1>
                <br />
                <>
                    <span className='mb-2 text-xl'>Email</span>
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
                            onKeyDown={(e) => { e.key === "Enter" && handleLogin() }}
                        />
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{emailErrMsg}</span>
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
                            onKeyDown={(e) => { e.key === "Enter" && handleLogin() }}
                        />
                    </div>
                    <div className='h-6'>
                        <span className='text-red-600 text-xs ml-1'>{passwordErrMsg}</span>
                    </div>
                </>
                <button
                    className='bg-[#203FAF] rounded-xl py-4 mb-5 text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300 mt-5 w-1/2 mx-auto'
                    onClick={handleLogin}
                >
                    Continue
                </button>
                <button
                    className='mt-5 mx-4 hover:text-teal-400'
                    onClick={() => { navigate('/signup'); }}
                >
                    Don't have an account? Create one
                </button>
                
            </div>
        </div>
    )
}

export default Login
