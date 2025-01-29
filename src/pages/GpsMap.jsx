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

function GpsMap({ sensorData, isDarkMode, theme }) {
    const position = [sensorData.gps.latitude, sensorData.gps.longitude];
    const defaultPosition = [0, 0]; // Default center if no GPS data

    const mapTileUrl = isDarkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    return (
        <div>
            <h1 style={{ color: theme.text }}>GPS Location</h1>
            <div style={{ marginBottom: '20px' }}>
                <Card style={{ background: theme.componentBackground, color: theme.text }}>
                    <p><strong>Latitude:</strong> {sensorData.gps.latitude}</p>
                    <p><strong>Longitude:</strong> {sensorData.gps.longitude}</p>
                </Card>
            </div>
            <Card style={{ background: theme.componentBackground, color: theme.text }}>
                <MapContainer 
                    center={sensorData.gps.latitude !== 0 ? position : defaultPosition} 
                    zoom={13} 
                    style={{ height: '600px', width: '100%' }}
                >
                    <TileLayer url={mapTileUrl} />
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