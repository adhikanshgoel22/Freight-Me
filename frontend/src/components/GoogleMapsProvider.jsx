// GoogleMapsProvider.jsx
import { useJsApiLoader } from '@react-google-maps/api'

const libraries = ['places']

export default function GoogleMapsProvider({ children }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCaBaCT1RBLpuEefWowV_LWe8lXDHK0JH0",
    libraries,
  })
  
  if (loadError) return <div>Error loading Google Maps</div>
  if (!isLoaded) return <div>Loading Maps...</div>

  return children
}
