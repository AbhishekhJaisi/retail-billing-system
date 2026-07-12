import {  Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <section id="center">
            </section>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <div className="ticks"></div>
    </>
  )
}

export default App
