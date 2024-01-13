interface Waypoint {
    latitude: number;
    longitude: number;
}
interface Bounds {
    north: number;
    south: number;
    east: number;
    west: number;
}
/**
 *
 * @param waypoints A set of waypoints that make up a polyline for a navigational route
 * @param resolution The vertical distance, in meters, that each bound should satisfy.
 * @param distance The horizontal padding that each bound should take up
 * @returns {Bounds[]} An array of bounds centered around the given waypoint path
 */
declare const createRouteBlocker: (waypoints: Waypoint[], resolution: number, distance: number) => Bounds[];

export { type Bounds, type Waypoint, createRouteBlocker as default };
