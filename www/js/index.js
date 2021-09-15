// event listener on document
// bool for basemap control and pick-locationc
let basemapSwitch = true;
let pickLocationSwitch = true;
let coordinates;
let openObstructionPreviewContainerSwitch = false;
let clickObstructionInformations;
let featureLayer;

// close clicked-marker-container
document
  .getElementById("clicked-marker-container-close")
  .addEventListener("click", () => {
    document.getElementById("clicked-marker-container").style.display = "none";
  });

// show clicked-marker-container
document
  .querySelector(".obstruction-preview__btn")
  .addEventListener("click", () => {
    document.getElementById("clicked-marker-container").style.display = "flex";

    // close preview container
    document.getElementById("obstruction-preview-container").style.display =
      "none";
  });

function hasParentWithMatchingSelector(target, selector) {
  return [...document.querySelectorAll(selector)].some(
    (el) => el !== target && el.contains(target)
  );
}

document.addEventListener("click", (e) => {
  const container = document.getElementById("obstruction-preview-container");
  // detect click outside basemap container to close it
  // check if anything without the class name "basemap" got clicked
  const isChildElement = hasParentWithMatchingSelector(
    e.target,
    "#obstruction-preview-container"
  );

  if (
    container.style.height === "161px" &&
    (isChildElement ||
      e.target.classList.contains("obstruction-preview-container")) &&
    openObstructionPreviewContainerSwitch
  ) {
    container.style.height = "161px";
    openObstructionPreviewContainerSwitch = true;
  } else if (
    container.style.height === "161px" &&
    (!isChildElement ||
      e.target.classList.contains("obstruction-preview-container")) &&
    openObstructionPreviewContainerSwitch
  ) {
    container.style.height = "0px";
    openObstructionPreviewContainerSwitch = false;
  } else {
    container.style.height = "0px";
    openObstructionPreviewContainerSwitch = false;
  }
});

document.addEventListener("click", (e) => {
  const container = document.getElementById("basemap-container");
  // detect click outside basemap container to close it
  // check if anything without the class name "basemap" got clicked
  if (
    !e.target.classList.contains("basemap") &&
    container.style.height === "160px" &&
    basemapSwitch != false
  ) {
    container.style.height = "160px";
    basemapSwitch = false;
  } else if (
    !e.target.classList.contains("basemap") &&
    container.style.height === "160px" &&
    basemapSwitch === false
  ) {
    container.style.height = "0px";
    basemapSwitch = true;
  } else if (e.target.classList.contains("basemap")) {
    container.style.height = "160px";
    basemapSwitch = true;
  }
});

document.addEventListener("click", (e) => {
  const container = document.getElementById("pick-location-container");
  // detect click outside basemap container to close it
  // check if anything without the class name "basemap" got clicked
  if (
    !e.target.classList.contains("pick-location") &&
    container.style.height === "80px" &&
    pickLocationSwitch != false
  ) {
    container.style.height = "80px";
    pickLocationSwitch = false;
  } else if (
    !e.target.classList.contains("pick-location") &&
    container.style.height === "80px" &&
    pickLocationSwitch === false
  ) {
    if (!e.target.parentNode.classList.contains("pick-location")) {
      container.style.height = "0px";
      pickLocationSwitch = true;
      openDeficiencyDrawer();
    }
  } else if (e.target.classList.contains("pick-location")) {
    container.style.height = "80px";
    pickLocationSwitch = true;
  }
});

// Wait for the deviceready event before using any of Cordova's device APIs.
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  // Cordova is now initialized. Have fun!

  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

// stop showing welcome screen after 4 seconds
setTimeout(() => {
  document.getElementById("welcome-screen").style.display = "none";
}, 4000);

// filter
const openFilter = () => {
  // show filter content
  setTimeout(() => {
    document.getElementById("filter__content").style.display = "block";
  }, 300);

  // show filter
  document.getElementById("filter-container").style.width = "100%";
};

/* Set the width of the filter to 0 */
const closeFilter = () => {
  // hide filter content
  document.getElementById("filter__content").style.display = "none";

  // hide filter
  document.getElementById("filter-container").style.width = "0";
};

/* Set the width of the drawer to 0 */
const closeDrawer = () => {
  // hide drawer content
  document.getElementById("drawer__content").style.display = "none";

  // hide drawer
  document.getElementById("drawer-container").style.width = "0";
};

// setting
const openSettings = () => {
  // show settings content
  setTimeout(() => {
    document.getElementById("settings__content").style.display = "block";
  }, 300);

  // show settings
  document.getElementById("settings-container").style.width = "100%";
};

/* Set the width of the settings to 0 */
const closeSettings = () => {
  // hide settings content
  document.getElementById("settings__content").style.display = "none";

  // hide settings
  document.getElementById("settings-container").style.width = "0";
};

// map
let baseLayer = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
});

const map = L.map("map", {
  center: [52.283333, 8.05],
  zoom: 12,
  layers: [baseLayer],
});

// onclick events
map.on("click", (e) => {
  coordinates = e.latlng;
});

L.control.scale().addTo(map);

// zoom to current location on initial page load
const geolocate = () => {
  navigator.geolocation.getCurrentPosition(function (location) {
    const latlng = new L.LatLng(
      location.coords.latitude,
      location.coords.longitude
    );
    map.flyTo(latlng);
  });
};

geolocate();

// get lat long
const onLocationFound = (e) => {
  coordinates = e.latlng;
};

/*
setInterval(() => {
    console.log(coordinates)    
}, 2000);
*/

map.on("locationfound", onLocationFound);

const openDeficiencyDrawer = () => {
  // show drawer content
  setTimeout(() => {
    document.getElementById("drawer__content").style.display = "block";
    // add location of deficienty to drawer html
    document.getElementById(
      "drawer__coordinates"
    ).innerHTML = `Your picked coordinates: ${coordinates}`;
  }, 300);

  // show drawer
  document.getElementById("drawer-container").style.width = "100%";
};

// submit form
const form = document.getElementById("drawer__form");
form.onsubmit = async (e) => {
  // get input values
  const type = form.deficiency.value;
  const name = form.name.value;
  const mail = form.email.value;
  //const image = form.image.value;
  const description = document.getElementsByClassName(
    "drawer__input--textarea"
  )[0].value;

  let date = new Date().toISOString().slice(0, 10);

  const data = {
    type,
    name,
    mail,
    description,
    date,
    coordinates,
  };

  e.preventDefault();

  console.log(data);

  try {
    const res = await axios.post(
      "http://igf-srv-lehre.igf.uni-osnabrueck.de:41781/postObstruction",
      data
    );
    //console.log(res)
    console.log("hi");
  } catch (error) {
    console.log(error);
  }
};

const lc = L.control
  .locate({
    watch: true,
    enableHighAccuracy: true,
    position: "bottomright",
    setView: true,
    follow: true,
  })
  .addTo(map);

// show marker and zoom to current location on load
lc.start();

// toggle basemap container
const toggleBasemaps = () => {
  const container = document.getElementById("basemap-container");

  if (container.style.height === "160px") {
    container.style.height = "0px";
    basemapSwitch = true;
  } else {
    container.style.height = "160px";
  }
};

// toggle basemap container
const togglePickLocation = () => {
  const container = document.getElementById("pick-location-container");

  if (container.style.height === "80px") {
    container.style.height = "0px";
    pickLocationSwitch = true;
  } else {
    container.style.height = "80px";
  }
};

// switch current basemap
const switchBasemap = (event) => {
  const element = event.target.id;

  const osmDe = L.tileLayer(
    "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  const esri_WorldImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  const cartoDB_DarkMatter = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
    }
  );

  if (element === "standard-map") {
    map.removeLayer(baseLayer);
    map.addLayer(osmDe);
    baseLayer = osmDe;
  } else if (element === "sat-map") {
    map.removeLayer(baseLayer);
    map.addLayer(esri_WorldImagery);
    baseLayer = esri_WorldImagery;
  } else if (element == "dark-map") {
    map.removeLayer(baseLayer);
    map.addLayer(cartoDB_DarkMatter);
    baseLayer = cartoDB_DarkMatter;
  }
};

let currentMode = "light";
// dark/light mode
const switchMode = () => {
  let currentModeElement = document.getElementsByClassName(
    "settings__content-inner-title"
  )[0];
  const textArea = document.getElementsByClassName(
    "drawer__input--textarea"
  )[0];

  if (currentMode === "light") {
    // change mode
    document.documentElement.setAttribute("data-theme", "dark");
    // change text
    currentModeElement.innerHTML = "Light mode";
    // hide dark mode icon
    document.getElementById("dark-icon").style.display = "none";
    // show light mode icon
    document.getElementById("light-icon").style.display = "block";
    // change text color
    document.getElementById("pick-location-container-text").style.color =
      "white";
    document.getElementById("drawer__coordinates").style.color = "white";

    // change border radius of textarea
    textArea.style.borderRadius = "5px";
  } else {
    // change mode
    document.documentElement.setAttribute("data-theme", "light");
    // change text
    currentModeElement.innerHTML = "Dark mode";
    // show dark mode icon
    document.getElementById("dark-icon").style.display = "block";
    // hide light mode icon
    document.getElementById("light-icon").style.display = "none";
    // change text color
    document.getElementById("pick-location-container-text").style.color =
      "black";
    document.getElementById("drawer__coordinates").style.color = "black";

    // change border radius of textarea
    textArea.style.borderRadius = "0px";
  }

  // toggle mode
  currentMode === "light" ? (currentMode = "dark") : (currentMode = "light");
};

let selectedTypes = [];
const submitSearch = async (event) => {
  event.preventDefault();

  const days = event.target.days.value;
  let dateStart = event.target.start.value;
  let dateEnd = event.target.end.value;
  let emptyQuery = false;
  let errorMessage;

  const isDateEmpty = dateStart === "" && dateEnd === "";
  const isOneDaySpecified =
    (dateStart === "" && dateEnd !== "") ||
    (dateStart !== "" && dateEnd === "");
  const noDays = days === "";

  /*
   * handle days and time range
   */

  // Fall 1 (Tage ja, range nein nein)
  if (!noDays && isDateEmpty) {
    console.log(1);
  }

  // Fall 3
  if (!noDays && !isDateEmpty) {
    errorMessage = "Invalid request. Specify days OR select a time range.";
  }

  // Fall a (nur type wird angegeben)
  if (noDays && isDateEmpty && selectedTypes.length !== 0) {
  }

  // Fall b (tage nein, range ja nein || nein ja)
  if (noDays && isOneDaySpecified) {
    errorMessage =
      "Invalid request. You likely forgot to specify the time range.";
  }

  if (!isDateEmpty) {
    dateEnd = new Date(dateEnd);
    dateStart = new Date(dateStart);
  }

  if (dateEnd < dateStart) {
    errorMessage = "Invalid request. Start date must be before the end date.";
  }

  /*
   * check valid input
   */

  if (days === "" && selectedTypes.length === 0 && isDateEmpty) {
    emptyQuery = true;
  }

  if (errorMessage !== undefined) {
    document.getElementById("filter__content-error").style.display = "block";
    document.getElementById(
      "filter__content-error-message"
    ).innerHTML = errorMessage;
  } else {
    document.getElementById("filter__content-error").style.display = "none";
  }

  try {
    // valid query and no error message
    if (!emptyQuery && errorMessage === undefined) {
      const response = await axios.get(
        "http://igf-srv-lehre.igf.uni-osnabrueck.de:41781/filterObstructions",
        {
          params: {
            days,
            selectedTypes,
            dateStart,
            dateEnd,
          },
        }
      );

      // remove existing features from geojson
      removeFeatures();
      // add features returning from query to geojson
      addFeatures(response.data.rows);

      // wenn result ankommt, dann soll filter contaienr geschlossen werden, vorher dann spinner anzeigen
      if (response) {
        closeFilter();
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// change color and check selected types
const filterTypes = (event) => {
  const e = event.target;

  if (e.classList.value == "filter__options") {
    if (e.style.backgroundColor === "rgb(255, 137, 6)") {
      e.style.backgroundColor = "white";
      e.style.boxShadow = "none";
      e.style.border = "1px solid #dee0e4";

      // filter selectedTypes and delete item
      selectedTypes = selectedTypes.filter(
        (type) => type !== e.getAttribute("value")
      );
    } else {
      e.style.backgroundColor = "#ff8906";
      e.style.boxShadow = "rgb(0 0 0 / 35%) 0px 5px 15px";
      e.style.border = "none";

      // add type to selectedTypes
      selectedTypes.push(e.getAttribute("value"));
    }
  }
};

const stopGeolocation = () => {
  map.locate({
    watch: true,
    enableHighAccuracy: true,
    position: "bottomright",
    setView: false,
    follow: false,
  });
};

// toggle geolocation
// follow is enabled per default
let isGeolocationActive = true;

const toggleGelocation = () => {
  if (isGeolocationActive) {
    // change svg
    document.getElementById("gps-fixed").style.display = "none";
    document.getElementById("gps-not-fixed").style.display = "inline";

    stopGeolocation();

    // stop following
    lc.stopFollowing();
    isGeolocationActive = false;
  } else {
    // change svg
    document.getElementById("gps-fixed").style.display = "inline";
    document.getElementById("gps-not-fixed").style.display = "none";

    map.locate({
      watch: true,
      enableHighAccuracy: true,
      position: "bottomright",
      setView: true,
      follow: true,
    });

    lc.start();
    isGeolocationActive = true;
  }
};

// stop following on dragend
map.on("dragend", function (e) {
  if (isGeolocationActive) {
    // change svg
    document.getElementById("gps-fixed").style.display = "none";
    document.getElementById("gps-not-fixed").style.display = "inline";

    stopGeolocation();

    lc.stopFollowing();
    isGeolocationActive = false;
  }
});

// take picture
document.getElementById("drawer__take-photo").addEventListener("click", () => {
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 25,
    destinationType: Camera.DestinationType.FILE_URI,
  });

  function onSuccess(imageData) {
    const image = document.getElementById("myImage");
    image.src = "data:image/jpeg;base64," + imageData;

    console.log(image);

    // todo: send string to server
  }

  function onFail(message) {
    alert("Failed because: " + message);
  }
});

// icons for type
const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greyIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const violetIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const changeHTML = () => {
  const splitDate = clickObstructionInformations.date.split("T");
  let type;

  if (clickObstructionInformations.type == "object") {
    type = "No informations";
  } else {
    type = clickObstructionInformations.type;
  }

  document.getElementById("clicked-marker__content-type-js").innerHTML = type;
  document.getElementById("obstruction-preview__date").innerHTML = splitDate[0];
};

document.addEventListener("DOMContentLoaded", function (event) {
  fetchMarker();
});

// get all locations
const makeGetRequest = async () => {
  try {
    const response = await axios.get(
      "http://igf-srv-lehre.igf.uni-osnabrueck.de:41781/getAllObstructions"
    );

    return response.data.rows;
  } catch (e) {
    console.error(e);
  }
};

// toggle obstruction preview container
const toggleObstructionPreview = () => {
  // add informations to hmtl
  changeHTML();

  const container = document.getElementById("obstruction-preview-container");

  container.style.display = "grid";

  container.style.height = "161px";
  openObstructionPreviewContainerSwitch = true;
};

const clickOnFeature = async (e) => {
  try {
    // e.target.feature.properties.id
    const response = await axios.get(
      `http://igf-srv-lehre.igf.uni-osnabrueck.de:41781/getObstructionById/${e.target.feature.properties.id}`
    );

    clickObstructionInformations = response.data.rows[0];
    toggleObstructionPreview();
  } catch (error) {
    console.log(error);
  }
};

function onEachFeature(feature, layer) {
  //bind click
  layer.on({
    click: clickOnFeature,
  });
}

const fetchMarker = async () => {
  const data = await makeGetRequest();
  const geojson = createGeoJSON(data);

  featureLayer = L.geoJSON(geojson, {
    onEachFeature: onEachFeature,
  }).addTo(map);
};

const createGeoJSON = (features) => {
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  //Loop through the markers array
  features.map((marker) => {
    // create feature
    const feature = {
      type: "Feature",
      properties: {
        id: marker.id,
      },
      geometry: {
        type: "Point",
        coordinates: [marker.longitude, marker.latitude],
      },
    };

    // push features to feature array
    geojson.features.push(feature);
  });

  return geojson;
};

const removeFeatures = () => {
  featureLayer.clearLayers();
};

const addFeatures = (features) => {
  removeFeatures();

  const geojson = createGeoJSON(features);

  featureLayer = L.geoJSON(geojson, {
    onEachFeature: onEachFeature,
  }).addTo(map);
};

let markerSwitch = true;

document.addEventListener("click", (e) => {
  const container = document.getElementById("marker-container");
  // detect click outside basemap container to close it
  // check if anything without the class name "marker" got clicked
  if (
    !e.target.classList.contains("marker") &&
    container.style.height === "160px" &&
    markerSwitch != false
  ) {
    container.style.height = "160px";
    markerSwitch = false;
  } else if (
    !e.target.classList.contains("marker") &&
    container.style.height === "160px" &&
    markerSwitch === false
  ) {
    container.style.height = "0px";
    markerSwitch = true;
  } else if (e.target.classList.contains("marker")) {
    container.style.height = "160px";
    markerSwitch = true;
  }
});
