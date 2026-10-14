// Cities and neighbourhoods. x/y place each neighbourhood on the stylised
// city map (0–100). lat/lng are approximate centres, only used to snap a
// player's rounded location to a neighbourhood — exact positions are never stored.

export const CITIES = [
  { id: "london", name: "London", flag: "🇬🇧", water: "M-5,58 C15,52 25,66 40,62 C55,58 60,70 75,64 C88,59 95,66 105,62 L105,72 C95,76 88,69 75,74 C60,80 55,68 40,72 C25,76 15,62 -5,68Z" },
  { id: "nyc", name: "New York", flag: "🇺🇸", water: "M50,-5 C46,20 52,40 46,60 C42,75 48,90 44,105 L58,105 C62,90 56,75 60,60 C66,40 60,20 64,-5Z" },
  { id: "tokyo", name: "Tokyo", flag: "🇯🇵", water: "M80,-5 C76,20 86,35 82,55 C78,72 88,85 84,105 L105,105 L105,-5Z" },
];

export const NEIGHBOURHOODS = [
  { id: "soho", city: "london", name: "Soho", lat: 51.5137, lng: -0.1337, x: 34, y: 44, special: "The Grinning Doorway" },
  { id: "shoreditch", city: "london", name: "Shoreditch", lat: 51.5265, lng: -0.0786, x: 72, y: 30, special: "Mural Mike" },
  { id: "camden", city: "london", name: "Camden", lat: 51.539, lng: -0.1426, x: 28, y: 14, special: "Lock Gate Larry" },
  { id: "brixton", city: "london", name: "Brixton", lat: 51.4613, lng: -0.1156, x: 44, y: 88, special: "Market Moira" },
  { id: "greenwich", city: "london", name: "Greenwich", lat: 51.4826, lng: -0.0077, x: 84, y: 84, special: "Old Meridian" },
  { id: "soho-nyc", city: "nyc", name: "SoHo", lat: 40.7233, lng: -74.003, x: 30, y: 70, special: "Cast-Iron Cass" },
  { id: "dumbo", city: "nyc", name: "DUMBO", lat: 40.7033, lng: -73.9881, x: 72, y: 78, special: "Bridge Bert" },
  { id: "williamsburg", city: "nyc", name: "Williamsburg", lat: 40.7081, lng: -73.9571, x: 80, y: 50, special: "Water Tower Wanda" },
  { id: "harlem", city: "nyc", name: "Harlem", lat: 40.8116, lng: -73.9465, x: 28, y: 14, special: "Brownstone Benny" },
  { id: "shibuya", city: "tokyo", name: "Shibuya", lat: 35.6595, lng: 139.7005, x: 36, y: 60, special: "Crossing Kiko" },
  { id: "shimokitazawa", city: "tokyo", name: "Shimokitazawa", lat: 35.6618, lng: 139.6681, x: 14, y: 46, special: "Vintage Vee" },
  { id: "asakusa", city: "tokyo", name: "Asakusa", lat: 35.7148, lng: 139.7967, x: 70, y: 16, special: "Lantern Lou" },
  { id: "akihabara", city: "tokyo", name: "Akihabara", lat: 35.6984, lng: 139.7731, x: 60, y: 40, special: "Pixel Pip" },
];

export const MILESTONES = [10, 25, 50];

export const neighbourhood = (id) => NEIGHBOURHOODS.find((n) => n.id === id);
export const city = (id) => CITIES.find((c) => c.id === id);

function distanceKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Round to ~1km before doing anything with a position.
export const coarsen = ({ lat, lng }) => ({ lat: Math.round(lat * 100) / 100, lng: Math.round(lng * 100) / 100 });

export function nearestNeighbourhood(position, maxKm = 6) {
  let best = null;
  for (const n of NEIGHBOURHOODS) {
    const d = distanceKm(position, n);
    if (d <= maxKm && (!best || d < best.d)) best = { n, d };
  }
  return best?.n || null;
}
