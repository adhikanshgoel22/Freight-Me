import { useState, useCallback, useRef } from 'react'
import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api'

// Replace with your values
const MONDAY_API_KEY = process.env.REACT_APP_MONDAY_API_KEY
const BOARD_ID = process.env.REACT_APP_BOARD_ID; // 🔁 Your Board ID
const TICKET_COLUMN_ID = 'text01'; // 🔁 Column ID to search by
const CONFIRM_COLUMN_ID = 'status'; // 🔁 Column to display upon confirmation


const LOCATION_COLUMN_ID = 'location9'; // Pickup location column ID

const DROP_OFF_ADDRESS = '11 Grand Ave, Camellia NSW 2142';

const CITY_CENTERS = {
  Melbourne: { lat: -37.8136, lng: 144.9631, price: 209.95 },
  Sydney: { lat: -33.8688, lng: 151.2093, price: 179.95 },
  Canberra: { lat: -35.2809, lng: 149.13, price: 199.95 },
  Brisbane: { lat: -27.4698, lng: 153.0251, price: 219.95 },
};

const mapContainerStyle = {
  width: '100%',
  height: '250px',
  borderRadius: '12px',
  marginBottom: '1rem',
};

const defaultCenter = { lat: -33.8688, lng: 151.2093 };








export default function BookingForm() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [pickup, setPickup] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [price, setPrice] = useState(null);
  const [status, setStatus] = useState('');
  const [ticketData, setTicketData] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirmColumnValue, setConfirmColumnValue] = useState('');

  const autocompleteRef = useRef(null);

  const onLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      const address = place.formatted_address || place.name || '';
      setPickup(address);

      if (place.geometry?.location) {
        setPickupCoords({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  const getDistanceInKm = (origin, destination) => {
    return new Promise((resolve, reject) => {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [origin],
          destinations: [destination],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
          if (status !== 'OK') return reject(status);
          try {
            const element = response.rows[0].elements[0];
            if (element.status === 'OK') {
              resolve(element.distance.value / 1000);
            } else reject(element.status);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  const fetchTicketData = async () => {
    try {
      const query = `
        query {
          boards(ids: ${BOARD_ID}) {
            items_page(limit: 100) {
              items {
                name
                column_values {
                  id
                  
                  text
                }
              }
            }
          }
        }
      `;

      const res = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          Authorization: MONDAY_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const json = await res.json();
      const items = json?.data?.boards?.[0]?.items_page?.items || [];

      const found = items.find(item =>
        item.column_values.find(
          col => col.id === TICKET_COLUMN_ID && col.text?.trim() === ticketNumber.trim()
        )
      );

      if (!found) {
        setStatus('No matching ticket found.');
        return;
      }

      const locationCol = found.column_values.find(col => col.id === LOCATION_COLUMN_ID);
      const confirmCol = found.column_values.find(col => col.id === CONFIRM_COLUMN_ID);

      const location = locationCol?.text || '';
      setPickup(location);
      setTicketData(found);
      setConfirmColumnValue(confirmCol?.text || '');
      setStatus('Ticket found. You may now calculate the price.');
    } catch (err) {
      console.error(err);
      setStatus('Error retrieving ticket.');
    }
  };

  const handleCalculate = async () => {
    setStatus('');
    setPrice(null);
    setBookingConfirmed(false);

    if (!pickup) {
      setStatus('Please enter a pickup location.');
      return;
    }

    try {
      let matchedCity = null;
      for (const [city, data] of Object.entries(CITY_CENTERS)) {
        const distToCity = await getDistanceInKm(pickup, { lat: data.lat, lng: data.lng });
        if (distToCity <= 50) {
          matchedCity = { city, ...data };
          break;
        }
      }

      if (!matchedCity) {
        setStatus('Pickup location outside supported metro zones. Please contact us for further updates.');
        setPrice(0); // Or null, if you want to hide price
        return;
      }
      

      const distanceToDropOff = await getDistanceInKm(pickup, DROP_OFF_ADDRESS);

      setPrice(matchedCity.price);
      setStatus(
        `Pickup is within ${matchedCity.city} metro zone (~${distanceToDropOff.toFixed(
          2
        )} km to drop-off). Price: $${matchedCity.price.toFixed(2)} per panel.`
      );
    } catch (err) {
      console.error(err);
      setStatus('Error calculating distance.');
    }
  };

  const confirmBooking = () => {
    setBookingConfirmed(true);
    setStatus(`Booking confirmed for ticket ${ticketNumber}.`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Ticket input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-1">Ticket Number</label>
        <input
          type="text"
          value={ticketNumber}
          onChange={(e) => setTicketNumber(e.target.value)}
          className="w-full border rounded-md p-2"
        />
        <button
          onClick={fetchTicketData}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fetch Ticket
        </button>
      </div>

      {/* Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={pickupCoords || defaultCenter}
        zoom={pickupCoords ? 12 : 10}
      >
        {pickupCoords && <Marker position={pickupCoords} />}
      </GoogleMap>

      {/* Price display */}
      {price !== null && (
        <div className="text-center text-lg font-semibold text-green-700 mb-4">
          Estimated Price: ${price.toFixed(2)} per panel
        </div>
      )}

      {/* Locations */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Pickup Location</label>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup"
              className="w-full p-2 border rounded-md"
              disabled={bookingConfirmed}
            />
          </Autocomplete>
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 mb-1">Drop-off Location</label>
          <input
            type="text"
            value={DROP_OFF_ADDRESS}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <button
        onClick={handleCalculate}
        disabled={bookingConfirmed}
        className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 mb-3"
      >
        Calculate Price
      </button>

      {!bookingConfirmed && (

        <button
          onClick={confirmBooking}
          className="bg-green-600 text-white px-4 py-2 rounded-md w-full hover:bg-green-700"
        >
          Confirm Booking
        </button>
      )}

      {status && <p className="mt-4 text-sm text-center text-blue-700">{status}</p>}

      {bookingConfirmed && confirmColumnValue && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
          {/* <p className="font-semibold text-blue-800">Booking Status:</p> */}
          {/* <p className="text-gray-800">{confirmColumnValue}</p> */}
        </div>
      )}
    </div>
  );
}
