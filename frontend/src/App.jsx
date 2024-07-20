import UserContext from 'src/components/auth/UserContext';
import Views from './components/Views';

function App() {
  return (
    <UserContext>
      <Views />
    </UserContext>
  )
}

export default App
