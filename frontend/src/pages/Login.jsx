import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const Home = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailErrMsg, setEmailErrMsg] = useState("")
    const [passwordErrMsg, setPasswordErrMsg] = useState("")

    const navigate = useNavigate();
    const handleLogin = () => {
        if (emailErrMsg || passwordErrMsg) return;
        if (!email || !password) {
            if (!email) setEmailErrMsg("Email is required!")
            if (!password) setPasswordErrMsg("Password is required!")
            return;
        }
        axios
            .create({
                baseURL: import.meta.env.VITE_IS_DEV ? 'http://localhost:4000' : ''
            })
            .post('/api/v1/auth/login', { email, password })
            .then((res) => {
                console.log(res)
            })
            .catch((error) => {
                console.log(error)
            })

        setPassword(""); setEmail("");
    }

    return (
        <div className='w-full h-[1000px] flex flex-col items-center'>
            <div className='w-[90%] sm:w-[500px] m-auto flex flex-col justify-center'>
                <h1 className='text-center text-3xl'> Log In</h1>
                <br />
                <>
                    <span className='mb-1 ml-1'>Email</span>
                    <div className={`border-2 ${emailErrMsg ? 'border-red-600' : 'border-gray-500 focus-within:border-sky-500'} rounded-lg pl-4 py-2 mb-1`}>
                        <input
                            className='bg-transparent text-lg w-[90%] outline-none placeholder:text-neutral-500'
                            placeholder='Enter Email'
                            value={email}
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
                    <div className='h-7'>
                        <span className='text-red-600 text-sm ml-1'>{emailErrMsg}</span>
                    </div>
                </>
                <>
                    <span className='mb-1 ml-1'>Password</span>
                    <div className={`border-2 ${passwordErrMsg ? 'border-red-600' : 'border-gray-500 focus-within:border-sky-500'} rounded-lg pl-4 py-2 mb-1`}>
                        <input
                            className='bg-transparent text-lg w-[90%] outline-none placeholder:text-neutral-500'
                            placeholder='Enter Password'
                            value={password}
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
                    <div className='h-7'>
                        <span className='text-red-600 text-sm ml-1'>{passwordErrMsg}</span>
                    </div>
                </>
                <div className='w-full flex justify-center space-x-4 mt-3'>
                    <button
                        className='bg-teal-500 rounded-lg py-2 px-4 text-black hover:text-white hover:bg-teal-700 hover:[text-shadow:_0_1.5px_0_rgb(0_0_0_/_40%)] shadow-md ease-in-out duration-300'
                        onClick={handleLogin}
                    >
                        Log In
                    </button>
                    <button 
                        className='bg-neutral-600 rounded-lg py-2 px-4 hover:bg-neutral-400 hover:text-black hover:[text-shadow:_0_1.5px_0_rgb(255_255_255_/_40%)] shadow-md ease-in-out duration-300'
                        onClick={() => {navigate('/signup');}}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Home