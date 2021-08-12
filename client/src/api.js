import "regenerator-runtime/runtime";

import Geocode from "react-geocode";

import { func } from "prop-types";

const postRequest = (url, options) => {
  return window
    .fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("postRequest " + url + " error!");
      } else {
        return data;
      }
    });
};

const getRequest = (url, options) => {
  return window
    .fetch(url, {
      method: "GET",
      /* headers: {
        "Content-Type": "application/json",
      },*/
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("getRequest " + url + " error!");
      } else {
        return data;
      }
    });
};

const API_KEY = "AIzaSyDCGh24bypgqJqTzp04ap6vjRjSk9ICqic";

function setGeocodeAPIKey() {
  Geocode.setApiKey(API_KEY);
}

/////The function below used to get lat and lng from address
//input:address
//output: lat and lng

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
        function (error) {
          console.log(error);
          reject(arguments);
        }
      );
    } else {
      console.log("not surport");
      reject("not surport");
    }
  });
}

//get center point 

function getCenter(localPos, userPos) {
  var pointArray = userPos.slice(0);
  pointArray.push(localPos);

  var sortedLongitudeArray = pointArray.map((item) => item.lng).sort();

  var sortedLatitudeArray = pointArray.map((item) => item.lat).sort();
  var centerLongitude =
    (sortedLongitudeArray[0] +
      sortedLongitudeArray[sortedLongitudeArray.length - 1]) /
    2;
  const centerLatitude =
    (sortedLatitudeArray[0] +
      sortedLatitudeArray[sortedLatitudeArray.length - 1]) /
    2;

  return [centerLongitude, centerLatitude, pointArray];
}

//The function below used to get distance of two points

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

//calculate the distance between center point and all position.
function getMaxDistance(centerPoint, pointArray) {
  var max = getDistance(
    centerPoint.lat,
    centerPoint.lng,
    pointArray[0].lat,
    pointArray[0].lng
  );

  for (var i = 1; i < pointArray.length; i++) {
    var temp = getDistance(
      pointArray.lat,
      pointArray.lng,
      pointArray[i].lat,
      pointArray[i].lng
    );
    if (temp > max) {
      max = temp;
    }
  }

  return max;
}

//change zoom by distance
function changeZoom(distance) {
  if (distance < 0.2) {
    return 15;
  }

  if (distance < 3) {
    return 14;
  }

  if (distance < 5) {
    return 13;
  }

  if (distance < 10) {
    return 12;
  }

  if (distance < 25) {
    return 11;
  }

  if (distance < 50) {
    return 10;
  }

  if (distance < 100) {
    return 9;
  }

  if (distance < 250) {
    return 8;
  }

  if (distance < 500) {
    return 7;
  }

  if (distance < 1000) {
    return 6;
  }

  if (distance < 2000) {
    return 4;
  }

  if (distance < 5000) {
    return 3;
  }

  if (distance < 10000) {
    return 2;
  }

  return 1;
}

//get center point and zoom scale
function getCenterAndZoom(localPos, userPos) {
  var centerPoint = new Object();
  var centerPos = getCenter(localPos, userPos);
  centerPoint.lng = centerPos[0];
  centerPoint.lat = centerPos[1];

  var allPoint = centerPos[2];

  //cal zoom scale

  var zoom = changeZoom(getMaxDistance(centerPoint, allPoint));

  return [centerPoint, zoom];
}

function getUTCTimeStamp() {
  var targetDate = new Date(); // Current date/time of client
  var timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60; // Current UTC date/time expressed as seconds since midnight, January 1, 1970 UTC
  return timestamp;
}

//get dstOffset and rawOffset of the target position
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

//get target time by dstOffset, rawOffset of the target position

function getTargetTime(dstOffset, rawOffset) {
  var offsets = dstOffset * 1000 + rawOffset * 1000; // get DST and time zone offsets in milliseconds
  var localdate = new Date(getUTCTimeStamp() * 1000 + offsets); // Date object containing current time of target (timestamp + dstOffset + rawOffset)
  return localdate.toLocaleString();
}
//export
const api = {
  postRequest: postRequest,
  getRequest: getRequest,

  getLatAndLng: getLatAndLng,
  getLocalPosition: getLocalPosition,
  getDistance: getDistance,
  getMaxDistance: getMaxDistance,
  changeZoom: changeZoom,
  getTargetTimeInfoByPos: getTargetTimeInfoByPos,
  getTargetTime: getTargetTime,
  getUTCTimeStamp: getUTCTimeStamp,
  getCenterAndZoom: getCenterAndZoom,
};

export default api;
