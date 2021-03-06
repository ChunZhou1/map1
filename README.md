# Using google map API and google time zone API to diaplay target position on the map and target time

# How to run?

There are two ways to run:

1: The **index.html** is contained in the **"dist"** directory and can be run directly. (**recommend!!! support all browser**)

2: (Is **not** recomended)

    1)Open the Terminal under the "client" directory.

    2)If "node_modules" do not exist, run "npm install".

    3)Run "npm start".

**important!!** If you use **npm start** to load the web page, You may possibly not get the local position(safari), an error message will be displayed on the page.

Because Location is sensitive data! Requiring HTTPS to protect the privacy of your users' location data.

You can set Chrome or Firefox to the default browser when you use "npm start",

or you can go to "dist" directory and click "index.html" (support safari)

# Notice

search button support user location acquisition from browser

Searching user position is triggered by both button click, and press enter key on the keyboard **at the same time**

# How to compile?

1: Open the Terminal under the **Client** directory.

2: **npm install**

3: **npm run build**

# The program contains the following parts：

The component_map.js in the components directory contains the components on the page.

All API functions include in the api.js file.

# How to show a place on the map？

### 1: Call getLocalPosition to get the local longitude and latitude, Call getLatAndLng according to the address entered by the user to get the target longitude and latitude.

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

### 3: Call getCenter to calculate the center point from local postion and user postion array

```
function getCenter(localPos, userPos) {
  var pointArray = userPos.slice(0);
  pointArray.push(localPos);

  var sortedLongitudeArray = pointArray.map((item) => item.lng).sort();

  var sortedLatitudeArray = pointArray.map((item) => item.lat).sort();
  var centerLongitude =
    (sortedLongitudeArray[0] +
      sortedLongitudeArray[sortedLongitudeArray.length - 1]) /2;

  const centerLatitude =
    (sortedLatitudeArray[0] +
      sortedLatitudeArray[sortedLatitudeArray.length - 1]) /2;

  return [centerLongitude, centerLatitude, pointArray];
}


```

### 4: Call getMaxDistance to calculate the distance between center point and all position.

### 5: Call getCenterAndZoom to get the center point and zoom scale from the local position and user position array.

### 6: Set center and zoom scale to display the map.

```
   //get zoom scale and center point
    var parm = api.getCenterAndZoom(posLocal, userPos_g);

    setCenter(parm[0]);

    //set zoom scale
    setZoom(parm[1]);

```

# How to display target time and Time zone?

### 1: Call getUTCTimeStamp function to get timestamp.

```
function getUTCTimeStamp() {
  var targetDate = new Date(); // Current date/time of client
  var timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60; // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
  return timestamp;
}
```

### 2: Call getTargetTimeInfoByPos(by calling google timezone api) to get dst offset, raw offset and Time zone

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
    return [output.dstOffset, output.rawOffset, output.timeZoneId];
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
