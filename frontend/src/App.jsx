import { Route, Routes, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Products  from './pages/Products'
import './App.css'

function App() {

  return (
    <>
      <Routes>
       
        <Route path="/" element={<Navigate to="/register" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products  />} />
      </Routes>

      <div className="ticks"></div>
    </>
  )
}

export default App
