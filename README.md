# Route Bounder

### For creating "find along my route" tools
#### Takes into account Earth's curvature for precise bounds

[![temp-Imagegc-LWe0.jpg](https://i.postimg.cc/GhqP4fSj/temp-Imagegc-LWe0.jpg)](https://postimg.cc/yk335LKJ)

[![Screenshot-2024-01-06-at-12-17-55-PM.png](https://i.postimg.cc/m2mCw2FH/Screenshot-2024-01-06-at-12-17-55-PM.png)](https://postimg.cc/qzCNBrwJ)

#### Usage

-   `npm i route-bounder`
-   `const bounds = createRouteBlocker(waypoints, resolution, distance)` where `waypoints` is an array of coordinates (`{latitude, longitude}`)
-   Use your favorite API for finding places of interest along a route with given the array of bounds `{ north, east, south, west }`
