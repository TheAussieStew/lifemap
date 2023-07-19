import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { SearchBox } from '@mapbox/search-js-react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

export const mapboxAccessToken = 'pk.eyJ1IjoidGhlYXVzc2llc3RldyIsImEiOiJjbGd1ZW1qaHowZmZsM3NudWdvYTY0c255In0.T7PzJ-D4ifBUDtbnRNbXFA';

mapboxgl.accessToken = mapboxAccessToken

interface LocationProps {
    location: string
}

export const Location: React.FC<LocationProps> = (props: LocationProps) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(151.21512);
    const [lat, setLat] = useState(-33.861344);
    const [zoom, setZoom] = useState(9);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current as HTMLElement,
            center: [lng, lat],
            pitch: 45,
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12',
            zoom: zoom
        });
        map.current!.on('move', () => {
            setLng(Number(map.current!.getCenter().lng.toFixed(4)));
            setLat(Number(map.current!.getCenter().lat.toFixed(4)));
            setZoom(Number(map.current!.getZoom().toFixed(2)));
        });
        map.current!.on('style.load', () => {
            map.current!.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 9 
            });
            // add the DEM source as a terrain layer with exaggerated height
            map.current!.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
        });
        let lngLat = new mapboxgl.LngLat(lng, lat)
        let marker = new mapboxgl.Marker().setLngLat(lngLat).addTo(map.current!);
    });

    return (
        <div>
            <div style={{ position: "relative" }}>
                <div className="sidebar">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}
