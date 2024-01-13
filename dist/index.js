"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var calcEarthRadiusMeters = (latitudeRadians) => {
  const equatorialRadius = 6378137;
  const flattening = 1 / 298.257223563;
  const radius = equatorialRadius / Math.sqrt(1 - flattening * Math.sin(latitudeRadians) * Math.sin(latitudeRadians));
  return radius;
};
var calcLonDistance = ({ latitude, longitude }, distance) => {
  const earthRadius = calcEarthRadiusMeters(latitude * Math.PI / 180);
  const displacementRadians = distance / earthRadius;
  const newLonRad = longitude * Math.PI / 180 + displacementRadians;
  const newLonDegrees = (newLonRad + Math.PI) % (2 * Math.PI) - Math.PI;
  return newLonDegrees * 180 / Math.PI;
};
function calcVerticalDistance(waypointA, waypointB) {
  const lat1Rad = waypointA.latitude * Math.PI / 180;
  const lat2Rad = waypointB.latitude * Math.PI / 180;
  const radius1 = calcEarthRadiusMeters(lat1Rad);
  const radius2 = calcEarthRadiusMeters(lat2Rad);
  const centralAngle = 2 * Math.asin(
    Math.sqrt(
      Math.pow(Math.sin((lat2Rad - lat1Rad) / 2), 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(
        Math.sin(
          (waypointB.longitude - waypointA.longitude) * Math.PI / 180
        ) / 2,
        2
      )
    )
  );
  const verticalDistance = (radius1 + radius2) * centralAngle / 2;
  return verticalDistance;
}
var calcBounds = ({ latitude: latA, longitude: lngA }, { latitude: latB, longitude: lngB }, distance) => {
  const startLon = lngA < lngB ? lngA : lngB;
  const endLon = lngA > lngB ? lngA : lngB;
  const southLat = latA < latB ? latA : latB;
  const northLat = latA > latB ? latA : latB;
  const startWaypoint = { latitude: latA, longitude: startLon };
  const endWaypoint = { latitude: latA, longitude: endLon };
  const eastLon = calcLonDistance(startWaypoint, -1 * distance);
  const westLon = calcLonDistance(endWaypoint, distance);
  return {
    north: northLat,
    south: southLat,
    east: eastLon,
    west: westLon
  };
};
var createRouteBlocker = (waypoints, resolution, distance) => {
  let startWaypoint = waypoints[0];
  let bounds = [];
  for (const waypoint of waypoints) {
    const vertDistance = calcVerticalDistance(startWaypoint, waypoint);
    if (vertDistance >= resolution) {
      bounds.push(calcBounds(startWaypoint, waypoint, distance));
      startWaypoint = waypoint;
    }
  }
  return bounds;
};
var src_default = createRouteBlocker;
//# sourceMappingURL=index.js.map