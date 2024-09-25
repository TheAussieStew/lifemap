import './styles.scss';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import Map, { MapRef, MapEvent } from 'react-map-gl';
import { SearchBox } from '@mapbox/search-js-react';

export const mapboxAccessToken = 'pk.eyJ1IjoidGhlYXVzc2llc3RldyIsImEiOiJjbGd1ZW1qaHowZmZsM3NudWdvYTY0c255In0.T7PzJ-D4ifBUDtbnRNbXFA';

mapboxgl.accessToken = mapboxAccessToken;

interface LocationProps {
    location: string;
}

export const Location: React.FC<LocationProps> = (props: LocationProps) => {
    const [lng, setLng] = useState(153.5341);
    const [lat, setLat] = useState(-28.5099);
    const [zoom, setZoom] = useState(9);
    const mapRef = useRef<MapRef>(null);

    const handleMapLoad = (event: MapEvent) => {
        const map = event.target as MapboxMap;

        // Check if the DEM source already exists to prevent duplicates
        if (!map.getSource('mapbox-dem')) {
            map.addSource('mapbox-dem', {
                type: 'raster-dem',
                url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
                tileSize: 512,
                maxzoom: 14
            });
        }

        // Set the terrain using the DEM source with an exaggeration factor
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 2.5 });

        // Add a sky layer to enhance the 3D visualization
        if (!map.getLayer('sky')) {
            map.addLayer({
                id: 'sky',
                type: 'sky',
                paint: {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });
        }
    };

    return (
        <div style={{ borderRadius: 5, overflow: "hidden" }}>
            <Map
                ref={mapRef}
                mapboxAccessToken={mapboxAccessToken}
                initialViewState={{
                    longitude: lng,
                    latitude: lat,
                    zoom: zoom,
                    pitch: 45, // Tilt the map view by 35 degrees
                    bearing: 0  // Optional: Set bearing if needed
                }}
                style={{ width: "100%", height: 400 }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                onLoad={handleMapLoad} // Attach the onLoad handler
            />
        </div>
    );
};
