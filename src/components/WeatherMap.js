import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import '../App.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';

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
  const [selectedStation, setSelectedStation] = useState(null);
  const [weatherData, setWeatherData] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]); // Changed to an array to store selected states
  const [states, setStates] = useState([]);

  // Fetch weather stations and their data
  useEffect(() => {
    axios
      .get('https://localhost:7029/api/WeatherStations')  // Your API endpoint for stations
      .then((response) => {
        setStations(response.data);
        // Extract unique states from the fetched stations
        const uniqueStates = [...new Set(response.data.map((station) => station.state))];
        setStates(uniqueStates); // Populate state options
      })
      .catch((error) => console.error('There was an error fetching the weather stations!', error));
  }, []);

  // Fetch weather data for the selected station
  const fetchWeatherData = (stationId) => {
    axios
      .get(`https://localhost:7029/api/WeatherStations/${stationId}/latestdata`)  // Your API for weather data
      .then((response) => {
        setWeatherData(response.data);
      })
      .catch((error) => console.error('Error fetching weather data', error));
  };

  // Handle checkbox changes
  const handleStateChange = (state) => {
    setSelectedStates((prevState) =>
      prevState.includes(state)
        ? prevState.filter((item) => item !== state)
        : [...prevState, state]
    );
  };

  // Select/Deselect All states
  const handleSelectAll = () => {
    if (selectedStates.length === states.length) {
      setSelectedStates([]); // If all are selected, unselect all
    } else {
      setSelectedStates(states); // Select all states
    }
  };

  // Filter stations based on selected states
  const filteredStations = selectedStates.length > 0
    ? stations.filter((station) => selectedStates.includes(station.state))
    : stations;

  return (
    <div className="map-container">
      {/* Filter Section on the Left */}
      <div className="filter-section">
        <div className="filter-container">
          <h3 className="filter-heading">Filter by State</h3>
          {/* 'All' Checkbox */}
          <Form.Check
            type="checkbox"
            label="All"
            checked={selectedStates.length === states.length}
            onChange={handleSelectAll}
            defaultChecked
            className="checkbox-item"
          />
          {/* State checkboxes */}
          {states.map((state) => (
            <Form.Check
              key={state}
              type="checkbox"
              label={state}
              checked={selectedStates.includes(state)}
              onChange={() => handleStateChange(state)}
              className="checkbox-item"
            />
          ))}
        </div>
      </div>

      {/* Main Map Section */}
      <div>
        <LoadScript googleMapsApiKey="AIzaSyBnVTM9qIjFT4rLcruTAK5vjWe5ylLALL4">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
          >
            {filteredStations.map((station) => (
              <Marker
                key={station.id}
                position={{ lat: station.latitude, lng: station.longitude }}
                onClick={() => {
                  setSelectedStation(station);
                  fetchWeatherData(station.id); // Fetch weather data when marker is clicked
                }}
              />
            ))}

            {selectedStation && (
                <InfoWindow
                  position={{
                    lat: selectedStation.latitude,
                    lng: selectedStation.longitude,
                  }}
                onCloseClick={() => setSelectedStation(null)}
                >
                  <div className="info-window">
                    <h3>{selectedStation.ws_name}</h3>
                    <p>
                      <strong>Site:</strong> {selectedStation.site}
                    </p>
                    <p>
                      <strong>State:</strong> {selectedStation.state}
                    </p>
                    <p>
                      <strong>Portfolio:</strong> {selectedStation.portfolio}
                    </p>
                    {weatherData ? (
                      <div>
                        <p>
                          <strong>Timestamp:</strong> {weatherData.timestamp}
                        </p>
                        <h4>Variables:</h4>
                        <table className="table-style">
                          <thead>
                            <tr>
                              <th>Long Name</th>
                              <th>Variable Name</th>
                              <th>Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedStation.weatherVariables?.map((variable) => (
                              <tr key={variable.var_id}>
                                <td>{variable.long_name}</td>
                                <td>{variable.name}</td>
                                <td>{variable.unit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div className="footer-lat-lng">
                          <p>
                            <strong>Latitude:</strong> {selectedStation.latitude}
                          </p>
                          <p>
                            <strong>Longitude:</strong> {selectedStation.longitude}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p>Loading weather data...</p>
                    )}
                  </div>
                </InfoWindow>
              )
            }
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default App;
