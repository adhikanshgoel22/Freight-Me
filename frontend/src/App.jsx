import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ComingSoon from './pages/ComingSoon';
import GoogleMapsProvider from './components/GoogleMapsProvider';
import ServerLogin from './components/ServerLogin';
import TicketTable from './components/TicketTable';
import TableWithDownload from './components/ServerTable';
import MondayBoardViewer from './components/MondayBoardViewer';
import MondayTableWithExport from './components/ServerTable';
import LandingPage from './pages/LandingPage';
import Dashboard from './components/Dashboard';
import ClientTable from './components/ClientTable';
import Contact from './pages/Contact';
import BookingForm from './components/BookingForm'; // ✅ Import this
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute"; // if used
import About from './pages/About';
import Query from './pages/Query';
import Login from './components/Login';
import New from './pages/New';
export default function App() {
  return (
    <GoogleMapsProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/server" element={<ServerLogin />} />
        <Route path="/tit" element={<TicketTable />} />
        <Route path="/ti" element={<TableWithDownload />} />
        
        <Route path="/view2" element={<MondayBoardViewer />} />
        {/* <Route path="/client/view" element={<ClientTable />} /> */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      
        <Route path="/booking/:userHash" element={<BookingForm />} />
        <Route path="/table/:userHash" element={<ClientTable />} />

        <Route path="/server/:usernameHash" element={<MondayTableWithExport />} />
        <Route path="/queries" element={<Query />} />
        {/* <Route path="/new/:userHash" element={<New />} /> */}

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </GoogleMapsProvider>
  );
}
