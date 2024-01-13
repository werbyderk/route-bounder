"use strict";
exports.__esModule = true;
exports.createRouteBlocker = exports.calcLatDistance = exports.calcLonDistance = void 0;
var calcEarthRadiusMeters = function (latitudeRadians) {
    // Constants based on the WGS84 ellipsoid model
    var equatorialRadius = 6378137.0; // meters
    var flattening = 1 / 298.257223563;
    // Calculate the radius using the formula
    var radius = equatorialRadius /
        Math.sqrt(1 - flattening * Math.sin(latitudeRadians) * Math.sin(latitudeRadians));
    return radius;
};
var calcLonDistance = function (_a, distance) {
    var latitude = _a.latitude, longitude = _a.longitude;
    var earthRadius = calcEarthRadiusMeters((latitude * Math.PI) / 180); // Calculate radius at given latitude
    var displacementRadians = distance / earthRadius;
    var newLonRad = (longitude * Math.PI) / 180 + displacementRadians;
    var newLonDegrees = ((newLonRad + Math.PI) % (2 * Math.PI)) - Math.PI; // Wrap longitude correctly
    return (newLonDegrees * 180) / Math.PI;
};
exports.calcLonDistance = calcLonDistance;
var calcLatDistance = function (lat, distance) {
    var earthRadius = calcEarthRadiusMeters((lat * Math.PI) / 180); // Calculate radius at given latitude
    var displacementRadians = distance / earthRadius;
    // Calculate new latitude
    var newLatRad = (lat * Math.PI) / 180 + displacementRadians;
    // Wrap latitude between -90 and 90 degrees
    var newLatDegrees = ((newLatRad + Math.PI) % (2 * Math.PI)) - Math.PI;
    return (newLatDegrees * 180) / Math.PI;
};
exports.calcLatDistance = calcLatDistance;
function calcVerticalDistance(waypointA, waypointB) {
    // Convert latitudes to radians
    var lat1Rad = (waypointA.latitude * Math.PI) / 180;
    var lat2Rad = (waypointB.latitude * Math.PI) / 180;
    // Calculate Earth's radii at both latitudes
    var radius1 = calcEarthRadiusMeters(lat1Rad);
    var radius2 = calcEarthRadiusMeters(lat2Rad);
    // Calculate the central angle between the points using the Haversine formula
    var centralAngle = 2 *
        Math.asin(Math.sqrt(Math.pow(Math.sin((lat2Rad - lat1Rad) / 2), 2) +
            Math.cos(lat1Rad) *
                Math.cos(lat2Rad) *
                Math.pow(Math.sin(((waypointB.longitude - waypointA.longitude) * Math.PI) / 180) / 2, 2)));
    // Calculate the vertical distance using the arc length formula
    var verticalDistance = ((radius1 + radius2) * centralAngle) / 2;
    return verticalDistance;
}
// Create a rectangle whose length covers coordinates A and B with distance padding on each side
var calcBounds = function (_a, _b, distance) {
    var latA = _a.latitude, lngA = _a.longitude;
    var latB = _b.latitude, lngB = _b.longitude;
    var startLon = lngA < lngB ? lngA : lngB;
    var endLon = lngA > lngB ? lngA : lngB;
    var southLat = latA < latB ? latA : latB;
    var northLat = latA > latB ? latA : latB;
    var startWaypoint = { latitude: latA, longitude: startLon };
    var endWaypoint = { latitude: latA, longitude: endLon };
    var eastLon = (0, exports.calcLonDistance)(startWaypoint, -1 * distance);
    var westLon = (0, exports.calcLonDistance)(endWaypoint, distance);
    return {
        north: northLat,
        south: southLat,
        east: eastLon,
        west: westLon
    };
};
/**
 *
 * @param waypoints A set of waypoints that make up a polyline for a navigational route
 * @param resolution The vertical distance, in meters, that each bound should satisfy.
 * @param distance The horizontal padding that each bound should take up
 * @returns {Bounds[]} An array of bounds centered around the given waypoint path
 */
var createRouteBlocker = function (waypoints, resolution, distance) {
    var startWaypoint = waypoints[0];
    var bounds = [];
    for (var _i = 0, waypoints_1 = waypoints; _i < waypoints_1.length; _i++) {
        var waypoint = waypoints_1[_i];
        var vertDistance = calcVerticalDistance(startWaypoint, waypoint);
        if (vertDistance >= resolution) {
            bounds.push(calcBounds(startWaypoint, waypoint, distance));
            startWaypoint = waypoint;
        }
    }
    return bounds;
};
exports.createRouteBlocker = createRouteBlocker;
