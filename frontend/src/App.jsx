import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ComingSoon from './pages/ComingSoon'
import GoogleMapsProvider from './components/GoogleMapsProvider'
import ServerLogin from './components/ServerLogin';
import TicketLookup from './components/Fetch';
import TicketTable from './components/TicketTable';
import TableWithDownload from './components/ServerTable';
import MondayBoardViewer from './components/MondayBoardViewer';
import MondayTableWithExport from './components/ServerTable';

export default function App() {
  return (
    <GoogleMapsProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/server" element={<ServerLogin/>} />
        <Route path="/tix" element={<TicketLookup/>} />
        <Route path="/tit" element={<TicketTable/>} />
        <Route path="/ti" element={<TableWithDownload/>} />
        <Route path="/view" element={<MondayTableWithExport/>} />
        <Route path="/view2" element={<MondayBoardViewer/>} />
      </Routes>
    </GoogleMapsProvider>
  )
}
