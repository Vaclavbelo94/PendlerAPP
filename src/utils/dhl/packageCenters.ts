/**
 * DHL Package Centers in Germany with GPS coordinates
 */

export interface PackageCenter {
  id: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
  country: string;
}

export const DHL_PACKAGE_CENTERS: PackageCenter[] = [
  { id: 'hagen-fley', name: 'Hagen-Fley', city: 'Hagen-Fley', lat: 52.2042, lon: 13.3892, country: 'DE' },
  { id: 'bornicke', name: 'Börnicke', city: 'Börnicke', lat: 52.7506, lon: 13.0953, country: 'DE' },
  { id: 'rudersdorf', name: 'Rüdersdorf (u Berlína)', city: 'Rüdersdorf', lat: 52.4731, lon: 13.7942, country: 'DE' },
  { id: 'neumark', name: 'Neumark', city: 'Neumark', lat: 50.6667, lon: 12.3833, country: 'DE' },
  { id: 'bruchsal', name: 'Bruchsal', city: 'Bruchsal', lat: 49.1247, lon: 8.5983, country: 'DE' },
  { id: 'greven', name: 'Greven-Reckenfeld', city: 'Greven-Reckenfeld', lat: 52.0833, lon: 7.6333, country: 'DE' },
  { id: 'kitzingen', name: 'Kitzingen', city: 'Kitzingen', lat: 49.7372, lon: 10.1606, country: 'DE' },
  { id: 'regensburg', name: 'Regensburg', city: 'Regensburg', lat: 49.0134, lon: 12.1016, country: 'DE' },
  { id: 'neumuenster', name: 'Neumünster', city: 'Neumünster', lat: 54.0728, lon: 9.9858, country: 'DE' },
  { id: 'nohra', name: 'Nohra', city: 'Nohra', lat: 50.9833, lon: 11.0833, country: 'DE' },
  { id: 'osterweddingen', name: 'Osterweddingen', city: 'Osterweddingen', lat: 52.0833, lon: 11.4167, country: 'DE' },
  { id: 'ottendorf', name: 'Ottendorf-Okrilla', city: 'Ottendorf-Okrilla', lat: 51.1667, lon: 13.8833, country: 'DE' },
  { id: 'neustrelitz', name: 'Neustrelitz', city: 'Neustrelitz', lat: 53.3667, lon: 13.0667, country: 'DE' },
  { id: 'neuwied', name: 'Neuwied', city: 'Neuwied', lat: 50.4281, lon: 7.4606, country: 'DE' },
  { id: 'staufenberg', name: 'Staufenberg (Lutterberg)', city: 'Staufenberg', lat: 51.3833, lon: 9.6333, country: 'DE' },
  { id: 'hamburg', name: 'Hamburg (Allermöhe)', city: 'Hamburg', lat: 53.4794, lon: 10.1556, country: 'DE' },
  { id: 'bremen', name: 'Bremen Hemelingen', city: 'Bremen', lat: 53.0500, lon: 8.9167, country: 'DE' },
  { id: 'lahr', name: 'Lahr', city: 'Lahr', lat: 48.3394, lon: 7.8728, country: 'DE' },
  { id: 'radefeld', name: 'Radefeld', city: 'Radefeld', lat: 51.4167, lon: 12.4167, country: 'DE' },
  { id: 'augsburg', name: 'Augsburg / Gersthofen', city: 'Augsburg', lat: 48.4500, lon: 10.8833, country: 'DE' },
  { id: 'dorsten', name: 'Dorsten', city: 'Dorsten', lat: 51.6600, lon: 6.9650, country: 'DE' },
  { id: 'saulheim', name: 'Saulheim', city: 'Saulheim', lat: 49.8833, lon: 8.1500, country: 'DE' },
  { id: 'koeln', name: 'Köln (GVZ Eifeltor)', city: 'Köln', lat: 50.9667, lon: 6.9500, country: 'DE' },
  { id: 'feucht', name: 'Feucht', city: 'Feucht', lat: 49.3833, lon: 11.2167, country: 'DE' },
  { id: 'speyer', name: 'Speyer', city: 'Speyer', lat: 49.3194, lon: 8.4314, country: 'DE' },
  { id: 'guenzburg', name: 'Günzburg', city: 'Günzburg', lat: 48.4553, lon: 10.2739, country: 'DE' },
  { id: 'kongen', name: 'Köngen', city: 'Köngen', lat: 48.6833, lon: 9.3667, country: 'DE' },
  { id: 'eutingen', name: 'Eutingen', city: 'Eutingen', lat: 48.4667, lon: 8.7333, country: 'DE' },
  { id: 'krefeld', name: 'Krefeld', city: 'Krefeld', lat: 51.3333, lon: 6.5833, country: 'DE' },
  { id: 'hannover', name: 'Hannover (Anderten)', city: 'Hannover', lat: 52.3833, lon: 9.8167, country: 'DE' },
  { id: 'rodgau', name: 'Rodgau', city: 'Rodgau', lat: 50.0167, lon: 8.8833, country: 'DE' },
  { id: 'aschheim', name: 'Aschheim (včetně Aschheim II)', city: 'Aschheim', lat: 48.1750, lon: 11.7167, country: 'DE' },
  { id: 'obertshausen', name: 'Obertshausen', city: 'Obertshausen', lat: 50.0833, lon: 8.8500, country: 'DE' },
  { id: 'bochum', name: 'Bochum (Laer)', city: 'Bochum', lat: 51.5167, lon: 7.3167, country: 'DE' },
  { id: 'ludwigsfelde', name: 'Ludwigsfelde', city: 'Ludwigsfelde', lat: 52.2972, lon: 13.2597, country: 'DE' },
];

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the nearest package center to given coordinates
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @returns Nearest package center with distance
 */
export function findNearestCenter(userLat: number, userLon: number): { center: PackageCenter; distance: number } | null {
  if (!userLat || !userLon) return null;
  
  let nearestCenter: PackageCenter | null = null;
  let minDistance = Infinity;
  
  DHL_PACKAGE_CENTERS.forEach(center => {
    const distance = calculateDistance(userLat, userLon, center.lat, center.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCenter = center;
    }
  });
  
  return nearestCenter ? { center: nearestCenter, distance: minDistance } : null;
}

/**
 * Sort package centers by distance from user location
 * @param userLat User's latitude
 * @param userLon User's longitude
 * @returns Sorted array of centers with distances
 */
export function sortCentersByDistance(
  userLat: number, 
  userLon: number
): Array<{ center: PackageCenter; distance: number }> {
  return DHL_PACKAGE_CENTERS
    .map(center => ({
      center,
      distance: calculateDistance(userLat, userLon, center.lat, center.lon)
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get user's current location using browser geolocation API
 * @returns Promise with user coordinates or null if denied/unavailable
 */
export function getUserLocation(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.warn('Error getting user location:', error.message);
        resolve(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  });
}
