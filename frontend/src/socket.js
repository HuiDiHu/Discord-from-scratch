import { io } from 'socket.io-client'

const socket = user => new io(import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
        token: user.token
    }
});

export default socket;