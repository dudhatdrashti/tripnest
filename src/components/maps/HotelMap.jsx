import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Hotel, UtensilsCrossed, Landmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import 'leaflet/dist/leaflet.css';

const createIcon = (color, IconComponent) => {
  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${
      IconComponent ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18M6 21V7l4-4 4 4v14M10 7v14M14 21V11M18 21V9l-2-2"/></svg>` : ''
    }</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  return icon;
};

const hotelIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #3b82f6; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-weight: bold; font-size: 12px;">H</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const attractionIcon = createIcon('#ef4444');
const restaurantIcon = createIcon('#22c55e');

export default function HotelMap({ hotel }) {
  const { t } = useTranslation();
  const [lat, lng] = hotel.location.coordinates;

  const attractions = hotel.nearbyAttractions.map((a, i) => ({
    ...a,
    coordinates: [lat + (Math.random() - 0.5) * 0.05, lng + (Math.random() - 0.5) * 0.05],
  }));

  const restaurants = hotel.nearbyRestaurants.map((r, i) => ({
    ...r,
    coordinates: [lat + (Math.random() - 0.5) * 0.04, lng + (Math.random() - 0.5) * 0.04],
  }));

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '400px', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Hotel */}
        <Marker position={[lat, lng]} icon={hotelIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{hotel.name}</p>
              <p className="text-sm text-gray-600">{hotel.location.address}</p>
            </div>
          </Popup>
        </Marker>

        {/* Attractions */}
        {attractions.map((attraction) => (
          <Marker key={attraction.id} position={attraction.coordinates} icon={attractionIcon}>
            <Popup>
              <div className="flex items-center gap-2">
                <Landmark className="w-4 h-4 text-red-500" />
                <span className="font-medium">{attraction.name}</span>
              </div>
              <p className="text-sm text-gray-600">{attraction.distance} {t('ui.away')}</p>
            </Popup>
          </Marker>
        ))}

        {/* Restaurants */}
        {restaurants.map((restaurant) => (
          <Marker key={restaurant.id} position={restaurant.coordinates} icon={restaurantIcon}>
            <Popup>
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-green-500" />
                <span className="font-medium">{restaurant.name}</span>
              </div>
              <p className="text-sm text-gray-600">{restaurant.cuisine} · {restaurant.rating}★</p>
            </Popup>
          </Marker>
        ))}

        <Circle center={[lat, lng]} radius={2000} pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.05 }} />
      </MapContainer>
    </div>
  );
}
