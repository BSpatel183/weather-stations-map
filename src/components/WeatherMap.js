import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import '../App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100vh', // Full height for the map
};

const center = {
  lat: -25.2744,
  lng: 133.7751,
};

const App = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    axios
      .get('https://localhost:7029/api/WeatherStations')  // Your API endpoint for stations
      .then((response) => {
        setStations(response.data);
      })
      .catch((error) => console.error('There was an error fetching the weather stations!', error));
  }, []);

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
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={{ lat: station.latitude, lng: station.longitude }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default App;
