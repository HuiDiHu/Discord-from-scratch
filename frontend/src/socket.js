import { io } from 'socket.io-client'

const socket = new io(import.meta.env.VITE_IS_DEV ? import.meta.env.VITE_SERVER_DEV_URL : import.meta.env.VITE_SERVER_URL, {
    autoConnect: false,
    withCredentials: true
});

export default socket;