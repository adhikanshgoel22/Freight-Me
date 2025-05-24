import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import GoogleMapsProvider from './components/GoogleMapsProvider'
import ServerLogin from './components/ServerLogin'

export default function App() {
  return (
    <GoogleMapsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/server" element={<ServerLogin/>} />
      </Routes>
    </GoogleMapsProvider>
  )
}
