# Use react + google map api + google time zone api for development

# How to run?

The **index.html** is contained in the **"dist"** directory and can be run directly.

# How to compile?
1: Open the Terminal under the **Client** directory

2: **npm install**

3: **npm run build"**

# The program contains the following parts：

The component_map.js in the compoents directory contains the components on the page.

All api functions include in the api.js file.

# How to show a place on the map？

### 1: Call getLocalPosition to get the local longitude and latitude,Call getLatAndLng according to the address entered by the user to get the target longitude and latitude.
   
   ```
 function getLocalPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let latitude = position.coords.latitude;
          let longitude = position.coords.longitude;
          let data = {
            latitude: latitude,
            longitude: longitude,
          };

          resolve(data);
        },
        function () {
          reject(arguments);
        }
      );
    } else {
      reject("not surport");
    }
  });
}

async function getLatAndLng(address) {
  setGeocodeAPIKey();

  try {
    var response = await Geocode.fromAddress(address);

    const { lat, lng } = response.results[0].geometry.location;

    return [lat, lng];
  } catch (err) {
    console.log(err);
    return [];
  }
}
   ```
   
### 2: Display marker on the map based on longitude and latitude.

### 3: Call getDistance to calculate distance between local position and target postion.
```
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = (lat1 * Math.PI) / 180.0;
  var radLat2 = (lat2 * Math.PI) / 180.0;
  var a = radLat1 - radLat2;
  var b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  var s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}
```

### 4: Use the distance parameter to call the changeZoom function to calculate the zoom of the map.

# How to display target time and UTC timestamp?

### 1: Call getUTCTimeStamp function to calculate UTC timestamp.

```
function getUTCTimeStamp() {
  var targetDate = new Date(); // Current date/time of client
  var timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60; // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
  return timestamp;
}
```

### 2: Call getTargetTimeInfoByPos(by calling google timezone api) to get dst offset and raw offset

```
 async function getTargetTimeInfoByPos(lat, lng) {
  //first create url
  var loc = lat + "," + lng;

  var timestamp = getUTCTimeStamp();

  var apikey = "AIzaSyD4irg3Kf989FRrRVxHlEJxAx2cXButGf0";
  var apicall =
    "https://maps.googleapis.com/maps/api/timezone/json?location=" +
    loc +
    "&timestamp=" +
    timestamp +
    "&key=" +
    apikey;

  //ajax request

  var output = await getRequest(apicall, "");

  if (output.status == "OK") {
    return [output.dstOffset, output.rawOffset];
  } else {
    console.log("get time info error");
    return [];
  }
}
```

### 3: Call getTargetTime to get target time (timestamp + dstOffset + rawOffset)

```
function getTargetTime(dstOffset, rawOffset) {
  var offsets = dstOffset * 1000 + rawOffset * 1000; // get DST and time zone offsets in milliseconds
  var localdate = new Date(getUTCTimeStamp() * 1000 + offsets); // Date object containing current time of target (timestamp + dstOffset + rawOffset)
  return localdate.toLocaleString();
}
```

# Some special considerations in the program

 1: You need to disable google map display before getting the local position ,otherwise the map will not be displayed properly.

 2: You need to disable google map display before changing the zoom and center of Google Maps.



