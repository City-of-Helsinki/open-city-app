import Geopoint from 'geopoint';

/**
 *
 * @param {number} latitude
 * @param {number} longitude
 * @param distance
 * @returns {string}
 */
export function calculateBoundingBox(latitude, longitude, distance) {
  const point = new Geopoint(latitude, longitude);
  const coords = point.boundingCoordinates(distance, null/* radius */, true/* inKilometers */);
  // Bounding box in WGS-84 coordinate format (left, bottom, right, top)
  return [coords[0].longitude(), coords[1].latitude(), coords[1].longitude(), coords[0].latitude()].join(',');
}

/**
 *
 * @param {object} position
 * @param {object} other
 * @returns {boolean}
 */
export function comparePositions(position, other) {
  return position.coords.latitude !== other.coords.latitude || position.coords.longitude !== other.coords.longitude;
}
