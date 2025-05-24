import BookingForm from './BookingForm'
// import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Welcome, CommBox</h1>
       
      </header>
      <BookingForm />
    </div>
  )
}
