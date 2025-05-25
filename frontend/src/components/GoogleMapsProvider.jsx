// GoogleMapsProvider.jsx
import { useJsApiLoader } from '@react-google-maps/api';


const libraries = ['places']

export default function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    
    googleMapsApiKey:process.env.REACT_APP_MAPS_API_KEY,
    libraries,
  })
  
  if (loadError) return <div>Error loading Google Maps</div>
  if (!isLoaded) return <div>Loading Maps...</div>

  return children
}
