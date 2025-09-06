import React from 'react'
import Login from './components/Login'
import { useSupabase } from './context/SupabaseContext'
import Navbar from './components/Navbar'

function App() {
  const { adminAuthenticated } = useSupabase()

  return (
    <div className="App">
      {!adminAuthenticated ? (
        // Agar admin login nahi hai, Login component show karo
        <Login />
      ) : (
        // Agar login hai, Navbar ke tabs ke through components show karo
        <Navbar />
      )}
    </div>
  )
}

export default App
