import Geopoint from 'geopoint';

/**
 *
 * @param {object} coords
 * @param {number} distance
 * @returns {string}
 */
export function calculateBoundingBox(coords, distance) {
  const point = new Geopoint(coords.latitude, coords.longitude);
  const bbox = point.boundingCoordinates(distance, null/* radius */, true/* inKilometers */);
  // Bounding box in WGS-84 coordinate format (left, bottom, right, top)
  return [bbox[0].longitude(), bbox[1].latitude(), bbox[1].longitude(), bbox[0].latitude()].join(',');
}

/**
 *
 * @param {object} coords
 * @param {object} target
 * @returns {number}
 */
export function calculateDistance(coords, target) {
  const pointFrom = new Geopoint(coords.latitude, coords.longitude);
  const pointTo = new Geopoint(target.latitude, target.longitude);
  return pointFrom.distanceTo(pointTo, true/* inKilometers */);
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
