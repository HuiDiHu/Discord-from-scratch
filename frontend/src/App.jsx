import { Routes, Route } from 'react-router-dom';
import Login from 'src/pages/Login';
import Signup from 'src/pages/Signup';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  )
}

export default App
