import './styles.scss';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import Map, { MapRef, MapEvent } from 'react-map-gl';
import { SearchBox } from '@mapbox/search-js-react';
import throttle from 'lodash/throttle'; // Import throttle from lodash

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
    const currentExaggeration = useRef<number | null>(null); // Ref to store current exaggeration

    // Function to calculate terrain exaggeration based on zoom level
    const calculateExaggeration = (currentZoom: number): number => {
        const minZoom = 5;
        const maxZoom = 14;
        const minExaggeration = 1.5;
        const maxExaggeration = 6.0; // Increased max exaggeration as per original instructions

        // Clamp zoom to the defined range
        const clampedZoom = Math.min(Math.max(currentZoom, minZoom), maxZoom);

        // Invert zoom: lower zoom (zoomed out) => higher exaggeration
        const proportion = (maxZoom - clampedZoom) / (maxZoom - minZoom);
        return minExaggeration + proportion * (maxExaggeration - minExaggeration);
    };

    const handleZoom = useCallback(
        throttle((map: MapboxMap) => {
            const currentZoom = map.getZoom();
            const newExaggeration = calculateExaggeration(currentZoom);

            // Only update if the exaggeration has changed to avoid unnecessary updates
            if (currentExaggeration.current !== newExaggeration) {
                map.setTerrain({ source: 'mapbox-dem', exaggeration: newExaggeration });
                currentExaggeration.current = newExaggeration;
            }
        }, 1000), // Throttle to once every 500ms
        []
    );

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

        // Set the initial terrain with the calculated exaggeration
        const initialExaggeration = calculateExaggeration(map.getZoom());
        map.setTerrain({ source: 'mapbox-dem', exaggeration: initialExaggeration });
        currentExaggeration.current = initialExaggeration;

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

        // Listen for zoom events to adjust terrain exaggeration dynamically
        map.on('zoom', () => handleZoom(map));
    };

    useEffect(() => {
        const map = mapRef.current ? mapRef.current.getMap() : null;
        if (map) {
            // Initialize currentExaggeration with the initial zoom level
            const initialExaggeration = calculateExaggeration(map.getZoom());
            currentExaggeration.current = initialExaggeration;
        }

        return () => {
            // Cleanup the throttle when the component unmounts
            handleZoom.cancel();
        };
    }, [handleZoom]);

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