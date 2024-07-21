import UserContext from 'src/components/auth/UserContext';
import Views from './components/Views';
import socket from './socket';

function App() {
  socket.connect()
  return (
    <UserContext>
      <Views />
    </UserContext>
  )
}

export default App
