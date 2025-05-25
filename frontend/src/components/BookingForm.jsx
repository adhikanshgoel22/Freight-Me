import { useState, useCallback, useRef } from 'react'
import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api'

const DROP_OFF_ADDRESS = '11 Grand Ave, Camellia NSW 2142'

const CITY_CENTERS = {
  Melbourne: { lat: -37.8136, lng: 144.9631, price: 209.95 },
  Sydney: { lat: -33.8688, lng: 151.2093, price: 179.95 },
  Canberra: { lat: -35.2809, lng: 149.13, price: 199.95 },
  Brisbane: { lat: -27.4698, lng: 153.0251, price: 219.95 },
}

const mapContainerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '12px',
  marginBottom: '1rem',
}

const defaultCenter = { lat: -33.8688, lng: 151.2093 } // Sydney default

export default function BookingForm() {
  const [pickup, setPickup] = useState('')
  const [pickupCoords, setPickupCoords] = useState(null)
  const [price, setPrice] = useState(null)
  const [status, setStatus] = useState('')
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')

  const autocompleteRef = useRef(null)

  const onLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete
  }, [])

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place.formatted_address) setPickup(place.formatted_address)
      else if (place.name) setPickup(place.name)

      if (place.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        setPickupCoords({ lat, lng })
      }
    }
  }

  const getDistanceInKm = (origin, destination) => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.DistanceMatrixService()
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status !== 'OK') return reject(status)
          try {
            const element = response.rows[0].elements[0]
            if (element.status === 'OK') {
              const km = element.distance.value / 1000
              resolve(km)
            } else reject(element.status)
          } catch (err) {
            reject(err)
          }
        }
      )
    })
  }

  const handleCalculate = async (e) => {
    e.preventDefault()
    setStatus('')
    setPrice(null)
    setBookingConfirmed(false)

    if (!pickup) {
      setStatus('Please enter a pickup location.')
      return
    }

    try {
      let matchedCity = null
      for (const [city, data] of Object.entries(CITY_CENTERS)) {
        const distToCity = await getDistanceInKm(pickup, { lat: data.lat, lng: data.lng })
        if (distToCity <= 50) {
          matchedCity = { city, ...data }
          break
        }
      }

      if (!matchedCity) {
        setStatus('Pickup location outside supported metro zones. Please contact us.')
        return
      }

      const distanceToDropOff = await getDistanceInKm(pickup, DROP_OFF_ADDRESS)

      setPrice(matchedCity.price)
      setStatus(
        `Pickup is within ${matchedCity.city} metro zone (~${distanceToDropOff.toFixed(
          2
        )} km to drop-off). Price: $${matchedCity.price.toFixed(2)} per panel.`
      )
    } catch (err) {
      console.error(err)
      setStatus('Error calculating distance. Please try again.')
    }
  }

  const handleConfirmBooking = () => {
    setShowModal(true)
  }

  const finalizeBooking = () => {
    if (!ticketNumber) {
      alert('Please enter a ticket number.')
      return
    }
    setBookingConfirmed(true)
    setStatus(`Booking confirmed with ticket #${ticketNumber}. Thank you.`)
    setShowModal(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Map Displayed at Top */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={pickupCoords || defaultCenter}
        zoom={pickupCoords ? 12 : 10}
      >
        {pickupCoords && <Marker position={pickupCoords} />}
      </GoogleMap>

      {/* Address fields below map - side-by-side */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="w-full sm:w-1/2">
          <label className="block text-gray-700 mb-1">Pickup location</label>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Start typing pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
              className="w-full p-2 border rounded-md"
              disabled={bookingConfirmed}
            />
          </Autocomplete>
        </div>

        <div className="w-full sm:w-1/2">
          <label className="block text-gray-700 mb-1">Drop-off location</label>
          <input
            type="text"
            value={DROP_OFF_ADDRESS}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100 text-gray-600"
          />
        </div>
      </div>

      {/* Booking Form Buttons */}
      <form className="bg-white p-6 rounded-xl shadow-md">
        <button
          onClick={handleCalculate}
          disabled={bookingConfirmed}
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 w-full mb-4"
        >
          Calculate Price
        </button>

        {price !== null && !bookingConfirmed && (
          <button
            onClick={handleConfirmBooking}
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 w-full"
          >
            Book a Panel?
          </button>
        )}

        {status && (
          <p className={`mt-4 text-sm ${bookingConfirmed ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        )}
      </form>

      {/* Modal for Ticket Number */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Enter Ticket Number</h3>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="Ticket number"
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={finalizeBooking}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// import { useState, useCallback, useRef } from 'react'
// import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api'
// import axios from 'axios'

// const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY ;// Add your API key here
// const BOARD_ID = process.env.REACT_APP_BOARD_ID  // Replace with your actual board ID (number)

// const DROP_OFF_ADDRESS = '11 Grand Ave, Camellia NSW 2142'

// const CITY_CENTERS = {
//   Melbourne: { lat: -37.8136, lng: 144.9631, price: 209.95 },
//   Sydney: { lat: -33.8688, lng: 151.2093, price: 179.95 },
//   Canberra: { lat: -35.2809, lng: 149.13, price: 199.95 },
//   Brisbane: { lat: -27.4698, lng: 153.0251, price: 219.95 },
// }

// const mapContainerStyle = {
//   width: '100%',
//   height: '250px',
//   borderRadius: '12px',
//   marginBottom: '1rem',
// }

// const defaultCenter = { lat: -33.8688, lng: 151.2093 } // Sydney default

// export default function BookingForm() {
//   const [pickup, setPickup] = useState('')
//   const [pickupCoords, setPickupCoords] = useState(null)
//   const [price, setPrice] = useState(null)
//   const [status, setStatus] = useState('')
//   const [bookingConfirmed, setBookingConfirmed] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const [ticketNumber, setTicketNumber] = useState('')
//   const [ticketDetails, setTicketDetails] = useState(null)
//   const [loadingTicket, setLoadingTicket] = useState(false)
//   const [errorTicket, setErrorTicket] = useState(null)

//   const autocompleteRef = useRef(null)

//   const onLoad = useCallback((autocomplete) => {
//     autocompleteRef.current = autocomplete
//   }, [])

//   const onPlaceChanged = () => {
//     if (autocompleteRef.current) {
//       const place = autocompleteRef.current.getPlace()
//       if (place.formatted_address) setPickup(place.formatted_address)
//       else if (place.name) setPickup(place.name)

//       if (place.geometry?.location) {
//         const lat = place.geometry.location.lat()
//         const lng = place.geometry.location.lng()
//         setPickupCoords({ lat, lng })
//       }
//     }
//   }

//   const getDistanceInKm = (origin, destination) => {
//     return new Promise((resolve, reject) => {
//       const service = new window.google.maps.DistanceMatrixService()
//       service.getDistanceMatrix(
//         {
//           origins: [origin],
//           destinations: [destination],
//           travelMode: window.google.maps.TravelMode.DRIVING,
//           unitSystem: window.google.maps.UnitSystem.METRIC,
//         },
//         (response, status) => {
//           if (status !== 'OK') return reject(status)
//           try {
//             const element = response.rows[0].elements[0]
//             if (element.status === 'OK') {
//               const km = element.distance.value / 1000
//               resolve(km)
//             } else reject(element.status)
//           } catch (err) {
//             reject(err)
//           }
//         }
//       )
//     })
//   }

//   const handleCalculate = async (e) => {
//     e.preventDefault()
//     setStatus('')
//     setPrice(null)
//     setBookingConfirmed(false)

//     if (!pickup) {
//       setStatus('Please enter a pickup location.')
//       return
//     }

//     try {
//       let matchedCity = null
//       for (const [city, data] of Object.entries(CITY_CENTERS)) {
//         const distToCity = await getDistanceInKm(pickup, { lat: data.lat, lng: data.lng })
//         if (distToCity <= 50) {
//           matchedCity = { city, ...data }
//           break
//         }
//       }

//       if (!matchedCity) {
//         setStatus('Pickup location outside supported metro zones. Please contact us.')
//         return
//       }

//       const distanceToDropOff = await getDistanceInKm(pickup, DROP_OFF_ADDRESS)

//       setPrice(matchedCity.price)
//       setStatus(
//         `Pickup is within ${matchedCity.city} metro zone (~${distanceToDropOff.toFixed(
//           2
//         )} km to drop-off). Price: $${matchedCity.price.toFixed(2)} per panel.`
//       )
//     } catch (err) {
//       console.error(err)
//       setStatus('Error calculating distance. Please try again.')
//     }
//   }

//   const handleConfirmBooking = () => {
//     setShowModal(true)
//     setTicketNumber('')
//     setTicketDetails(null)
//     setErrorTicket(null)
//   }

//   // Function to fetch ticket details from Monday.com by ticketNumber
//   const fetchTicketDetails = async (ticketNum) => {
//     setLoadingTicket(true)
//     setErrorTicket(null)
//     setTicketDetails(null)

//     try {
//       const query = `
//         query {
//           items_page_by_column_values(
//             board_id: ${BOARD_ID},
//             column_id: "text72",  # Replace with actual column ID for your ticket number
//             column_value: "${ticketNum}"
//           ) {
//             items {
//               id
//               name
//               column_values {
//                 id
//                 text
//               }
//             }
//           }
//         }
//       `

//       const res = await axios.post(
//         'https://api.monday.com/v2',
//         { query },
//         {
//           headers: {
//             Authorization: MONDAY_API_KEY,
//             'Content-Type': 'application/json',
//           },
//         }
//       )

//       const items = res.data.data.items_page_by_column_values.items
//       if (items.length === 0) {
//         setErrorTicket(`No ticket found with number: ${ticketNum}`)
//       } else {
//         setTicketDetails(items[0])
//       }
//     } catch (err) {
//       console.error(err)
//       setErrorTicket('Failed to fetch ticket details.')
//     } finally {
//       setLoadingTicket(false)
//     }
//   }

//   const finalizeBooking = async () => {
//     if (!ticketNumber) {
//       alert('Please enter a ticket number.')
//       return
//     }

//     await fetchTicketDetails(ticketNumber)

//     if (!ticketDetails) return // Stop if no details fetched

//     setBookingConfirmed(true)
//     setStatus(`Booking confirmed with ticket #${ticketNumber}. Thank you.`)
//     setShowModal(false)
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       {/* Map Displayed at Top */}
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={pickupCoords || defaultCenter}
//         zoom={pickupCoords ? 12 : 10}
//       >
//         {pickupCoords && <Marker position={pickupCoords} />}
//       </GoogleMap>

//       {/* Address fields below map - side-by-side */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
//         <div className="w-full sm:w-1/2">
//           <label className="block text-gray-700 mb-1">Pickup location</label>
//           <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
//             <input
//               type="text"
//               placeholder="Start typing pickup location"
//               value={pickup}
//               onChange={(e) => setPickup(e.target.value)}
//               required
//               className="w-full p-2 border rounded-md"
//               disabled={bookingConfirmed}
//             />
//           </Autocomplete>
//         </div>

//         <div className="w-full sm:w-1/2">
//           <label className="block text-gray-700 mb-1">Drop-off location</label>
//           <input
//             type="text"
//             value={DROP_OFF_ADDRESS}
//             readOnly
//             className="w-full p-2 border rounded-md bg-gray-100 text-gray-600"
//           />
//         </div>
//       </div>

//       {/* Booking Form Buttons */}
//       <form className="bg-white p-6 rounded-xl shadow-md">
//         <button
//           onClick={handleCalculate}
//           disabled={bookingConfirmed}
//           type="button"
//           className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 w-full mb-4"
//         >
//           Calculate Price
//         </button>

//         {price !== null && !bookingConfirmed && (
//           <button
//             onClick={handleConfirmBooking}
//             type="button"
//             className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 w-full"
//           >
//             Book a Panel?
//           </button>
//         )}

//         {status && (
//           <p className={`mt-4 text-sm ${bookingConfirmed ? 'text-green-600' : 'text-red-600'}`}>
//             {status}
//           </p>
//         )}
//       </form>

//       {/* Modal for Ticket Number */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h3 className="text-lg font-semibold mb-4">Enter Ticket Number</h3>
//             <input
//               type="text"
//               value={ticketNumber}
//               onChange={(e) => setTicketNumber(e.target.value)}
//               placeholder="Ticket number"
//               className="w-full p-2 border rounded mb-4"
//               disabled={loadingTicket}
//             />

//             {loadingTicket && <p className="text-sm mb-2">Loading ticket details...</p>}
//             {errorTicket && <p className="text-sm text-red-600 mb-2">{errorTicket}</p>}
//             {ticketDetails && (
//               <div className="mb-4 border p-2 rounded bg-gray-50 max-h-40 overflow-y-auto">
//                 <h4 className="font-semibold">Ticket Details:</h4>
//                 <p><strong>Name:</strong> {ticketDetails.name}</p>
//                 <ul className="list-disc pl-5">
//                   {ticketDetails.column_values.map((cv) => (
//                     <li key={cv.id}>
//                       <strong>{cv.title}:</strong> {cv.text}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//                 disabled={loadingTicket}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={finalizeBooking}
//                 className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                 disabled={loadingTicket}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Show ticket details summary after booking confirmed */}
//       {bookingConfirmed && ticketDetails && (
//         <div className="mt-6 p-4 border rounded shadow bg-green-50">
//           <h3 className="text-lg font-semibold mb-2">Booked Ticket Details</h3>
//           <p><strong>Ticket #:</strong> {ticketNumber}</p>
//           <p><strong>Name:</strong> {ticketDetails.name}</p>
//           <ul className="list-disc pl-5">
//             {ticketDetails.column_values.map((cv) => (
//               <li key={cv.id}>
//                 <strong>{cv.title}:</strong> {cv.text}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }
