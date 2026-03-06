import { divIcon } from 'leaflet'

export const MAP_DEFAULT_CENTER: [number, number] = [20.6296, -87.0739]
export const MAP_DEFAULT_ZOOM = 20
export const MAP_TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

export function formatNightlyPrice(value: number): string {
  return `$${Math.round(value)}`
}

export function createPriceIcon(price: number) {
  return divIcon({
    html: `<span class="map-price-pill">${formatNightlyPrice(price)}</span>`,
    className: 'map-price-marker',
    iconSize: [78, 32],
    iconAnchor: [39, 16],
    popupAnchor: [0, -18],
  })
}

export function createLocationPinIcon() {
  return divIcon({
    html: '<span class="map-location-pin"><span class="map-location-pin-dot"></span></span>',
    className: 'map-location-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}
