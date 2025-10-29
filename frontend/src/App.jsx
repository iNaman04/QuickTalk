import React from 'react'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { use } from 'react'
import { useAuthStore } from './store/useAuthStore.js'
import { Loader, Loader2 } from 'lucide-react'



const App = () => {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(() => {
   checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className= "size-10 animate-spin" />
      </div>
    )
  }

  

  return (

    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />

      </Routes>





    </div>






  )
}

export default App