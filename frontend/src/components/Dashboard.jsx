import BookingForm from './BookingForm'
// import { Link } from 'react-router-dom'
import Header from './Navbar'
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-50 ">
      <header className="flex-col justify-between items-center mb-6">
        <Header></Header>
        <h1 className="text-3xl font-bold text-blue-700">Welcome, CommBox</h1>
       
      </header>
      <BookingForm />
    </div>
  )
}
