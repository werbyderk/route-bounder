export interface Waypoint {
    latitude: number
    longitude: number
}

export interface Bounds {
    north: number
    south: number
    east: number
    west: number
}

const calcEarthRadiusMeters = (latitudeRadians: number): number => {
    // Constants based on the WGS84 ellipsoid model
    const equatorialRadius = 6378137.0 // meters
    const flattening = 1 / 298.257223563

    // Calculate the radius using the formula
    const radius =
        equatorialRadius /
        Math.sqrt(1 - flattening * Math.sin(latitudeRadians) * Math.sin(latitudeRadians))

    return radius
}

const calcLonDistance = ({ latitude, longitude }: Waypoint, distance: number): number => {
    const earthRadius = calcEarthRadiusMeters((latitude * Math.PI) / 180) // Calculate radius at given latitude
    const displacementRadians = distance / earthRadius

    const newLonRad = (longitude * Math.PI) / 180 + displacementRadians
    const newLonDegrees = ((newLonRad + Math.PI) % (2 * Math.PI)) - Math.PI // Wrap longitude correctly

    return (newLonDegrees * 180) / Math.PI
}

function calcVerticalDistance(waypointA: Waypoint, waypointB: Waypoint): number {
    // Convert latitudes to radians
    const lat1Rad = (waypointA.latitude * Math.PI) / 180
    const lat2Rad = (waypointB.latitude * Math.PI) / 180

    // Calculate Earth's radii at both latitudes
    const radius1 = calcEarthRadiusMeters(lat1Rad)
    const radius2 = calcEarthRadiusMeters(lat2Rad)

    // Calculate the central angle between the points using the Haversine formula
    const centralAngle =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin((lat2Rad - lat1Rad) / 2), 2) +
                    Math.cos(lat1Rad) *
                        Math.cos(lat2Rad) *
                        Math.pow(
                            Math.sin(
                                ((waypointB.longitude - waypointA.longitude) * Math.PI) / 180
                            ) / 2,
                            2
                        )
            )
        )

    // Calculate the vertical distance using the arc length formula
    const verticalDistance = ((radius1 + radius2) * centralAngle) / 2

    return verticalDistance
}

// Create a rectangle whose length covers coordinates A and B with distance padding on each side
const calcBounds = (
    { latitude: latA, longitude: lngA }: Waypoint,
    { latitude: latB, longitude: lngB }: Waypoint,
    distance: number
): Bounds => {
    const startLon = lngA < lngB ? lngA : lngB
    const endLon = lngA > lngB ? lngA : lngB

    const southLat = latA < latB ? latA : latB
    const northLat = latA > latB ? latA : latB
    const startWaypoint: Waypoint = { latitude: latA, longitude: startLon }
    const endWaypoint: Waypoint = { latitude: latA, longitude: endLon }

    const eastLon = calcLonDistance(startWaypoint, -1 * distance)
    const westLon = calcLonDistance(endWaypoint, distance)

    return {
        north: northLat,
        south: southLat,
        east: eastLon,
        west: westLon,
    }
}

/**
 *
 * @param waypoints A set of waypoints that make up a polyline for a navigational route
 * @param resolution The vertical distance, in meters, that each bound should satisfy.
 * @param distance The horizontal padding that each bound should take up
 * @returns {Bounds[]} An array of bounds centered around the given waypoint path
 */
const createRouteBlocker = (
    waypoints: Waypoint[],
    resolution: number,
    distance: number
): Bounds[] => {
    let startWaypoint = waypoints[0]
    let bounds: Bounds[] = []

    for (const waypoint of waypoints) {
        const vertDistance = calcVerticalDistance(startWaypoint, waypoint)
        if (vertDistance >= resolution) {
            bounds.push(calcBounds(startWaypoint, waypoint, distance))
            startWaypoint = waypoint
        }
    }

    return bounds
}

export default createRouteBlocker
