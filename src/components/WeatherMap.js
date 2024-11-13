import { LoadScript, GoogleMap } from '@react-google-maps/api';
import '../App.css'; 

const containerStyle = {
  width: '100%',
  height: '100vh', // Full height for the map
};

const center = {
  lat: -25.2744,
  lng: 133.7751,
};

const App = () => {
  return (
    <div className="map-container">
      {/* Main Map Section */}
      <div>
        <LoadScript googleMapsApiKey="AIzaSyBnVTM9qIjFT4rLcruTAK5vjWe5ylLALL4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
          >
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default App;
