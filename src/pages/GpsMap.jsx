import React from 'react';
import { Card } from 'antd';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DynamicMarker from '../components/DynamicMarker';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function GpsMap({ sensorData }) {
    const position = [sensorData.gps.latitude, sensorData.gps.longitude];
    const defaultPosition = [0, 0]; // Default center if no GPS data

    return (
        <div>
            <h1>GPS Location</h1>
            <div style={{ marginBottom: '20px' }}>
                <Card>
                    <p><strong>Latitude:</strong> {sensorData.gps.latitude}</p>
                    <p><strong>Longitude:</strong> {sensorData.gps.longitude}</p>
                </Card>
            </div>
            <Card>
                <MapContainer 
                    center={sensorData.gps.latitude !== 0 ? position : defaultPosition} 
                    zoom={13} 
                    style={{ height: '600px', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {sensorData.gps.latitude !== 0 && (
                        <Marker position={position}>
                            <Popup>
                                Latitude: {sensorData.gps.latitude}<br />
                                Longitude: {sensorData.gps.longitude}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </Card>
        </div>
    );
}

export default GpsMap;