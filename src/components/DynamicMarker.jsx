import React, { useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';

function DynamicMarker({ position }) {
    const map = useMap();

    useEffect(() => {
        if (position[0] !== 0 && position[1] !== 0) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    if (position[0] === 0 && position[1] === 0) {
        return null;
    }

    return (
        <Marker position={position}>
            <Popup>
                Latitude: {position[0]}<br />
                Longitude: {position[1]}
            </Popup>
        </Marker>
    );
}

export default DynamicMarker;