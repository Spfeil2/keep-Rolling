// setup global variables
let basemapSwitch = true;
let legendSwitch = true;
let pickLocationSwitch = true;
let coordinates;
let featureCoordinates;
let openObstructionPreviewContainerSwitch = false;
let clickObstructionInformations;
let featureLayer;
let image;
let currentMode = "light";
let selectedTypes = [];
let isGeolocationActive = true;
let markerSwitch = true;

// wait for the deviceready event before using any of cordova's device APIs.
document.addEventListener("deviceready", onDeviceReady, false);

// initialize cordova
function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("deviceready").classList.add("ready");
}

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

// check if click target is not a child of obstruction-preview-container
const hasParentWithMatchingSelector = (target, selector) => {
  return [...document.querySelectorAll(selector)].some(
    (el) => el !== target && el.contains(target)
  );
}

// detect click outside obstruction-preview-container to close ist
document.addEventListener("click", (e) => {
  const container = document.getElementById("obstruction-preview-container");
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

// detect click outside basemap container to close it
document.addEventListener("click", (e) => {
  const container = document.getElementById("basemap-container");

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

// detect click outside basemap container to close it
document.addEventListener("click", (e) => {
  const container = document.getElementById("pick-location-container");
  
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

// stop showing welcome screen after 4 seconds
setTimeout(() => {
  document.getElementById("welcome-screen").style.display = "none";
}, 4000);

// show filter drawer
const openFilter = () => {
  // show filter content with delay
  setTimeout(() => {
    document.getElementById("filter__content").style.display = "block";
  }, 300);
  document.getElementById("filter-container").style.width = "100%";
};

// close filter drawer
const closeFilter = () => {
  // hide filter content
  document.getElementById("filter__content").style.display = "none";
  document.getElementById("filter-container").style.width = "0";
};

// close drawer
const closeDrawer = () => {
  // hide drawer content
  document.getElementById("drawer__content").style.display = "none";
  document.getElementById("drawer-container").style.width = "0";
};

// open settings drawer
const openSettings = () => {
  // show settings content
  setTimeout(() => {
    document.getElementById("settings__content").style.display = "block";
  }, 300);
  document.getElementById("settings-container").style.width = "100%";
};

// close settings drawer
const closeSettings = () => {
  // hide settings content
  document.getElementById("settings__content").style.display = "none";
  document.getElementById("settings-container").style.width = "0";
};

// default OpenStreetMap basemap
let baseLayer = L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
});

// initialize map object
const map = L.map("map", {
  center: [52.283333, 8.05],
  zoom: 12,
  layers: [baseLayer],
});

// extract coordinates on click
map.on("click", (e) => {
  // use lat long for user position
  coordinates = e.latlng;
  // use lat long for the coordinates of the new obstruction
  featureCoordinates = e.latlng
});

// add scale to map
L.control.scale().addTo(map);

// zoom to current location via cordova geolocation API on initial page load
const geolocate = () => {
  navigator.geolocation.getCurrentPosition((location) => {
    const latlng = new L.LatLng(
      location.coords.latitude,
      location.coords.longitude
    );

    // zoom current location
    map.flyTo(latlng);
  });
};

geolocate();

// get lat long
const onLocationFound = (e) => {
  coordinates = e.latlng;
};

map.on("locationfound", onLocationFound);

const openDeficiencyDrawer = () => {
  // show drawer content with delay of 0,3 seconds
  setTimeout(() => {
    document.getElementById("drawer__content").style.display = "block";
    // add location of deficienty to drawer html
    document.getElementById(
      "drawer__coordinates"
    ).innerHTML = `Your picked coordinates: ${featureCoordinates}`;
  }, 300);

  // show drawer container
  document.getElementById("drawer-container").style.width = "100%";
};

// submit form
const form = document.getElementById("drawer__form");
form.onsubmit = async (e) => {
  // get input values
  const type = form.deficiency.value;
  const name = form.name.value;
  const mail = form.email.value;
  const description = document.getElementsByClassName(
    "drawer__input--textarea"
  )[0].value;

  // convert date object to string and slice to match used convention
  let date = new Date().toISOString().slice(0, 10);

  const data = {
    type,
    name,
    mail,
    description,
    date,
    featureCoordinates,
    image,
  };

  e.preventDefault();

  try {
    // validate user input
    if (!name || !mail || !description) {
      invalidInputErrorHandling();
    } else {
      // if valid input post request
      const postResponse = await axios.post(
        "http://igf-srv-lehre.igf.uni-osnabrueck.de:41782/postObstruction",
        data
      );

      // use placeholder image if non provided
      if (data.image === undefined) {
        data.image = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"
      } 

      // add new feature to map based on data object and returned id
      addNewFeature(data, postResponse.data.id);
      closeDrawer();
      resetImageFeedback()
      resetInputValues()
    }
  } catch (error) {
    console.log(error);
  }
};

const resetImageFeedback = () => {
  document.getElementById("drawer__foto-success-message").innerHTML = ""
  document.getElementById("drawer__take-photo").style.backgroundColor = "rgb(240, 240, 240)"
  document.getElementById("drawer__take-photo").style.border = "2px dashed #ff8e3c"

  // reset image data
  image = undefined;
}

const resetInputValues = () => {
  const inputs = document.getElementsByClassName("drawer__input")
  const textarea = document.getElementsByClassName("drawer__input--textarea")

  for (let input of inputs) {
    input.value = ""
  }

  for (let input of textarea) {
    input.value = ""
  }
}


// add new feature to existing map
const addNewFeature = (data, id) => {
  console.log(data)
  console.log(id)

  // slice to match precision
  let sliceNumber = (num, len) => +String(num).slice(0, len);
  const lat = sliceNumber(data.featureCoordinates.lat, 7);
  const lng = sliceNumber(data.featureCoordinates.lng, 7);


  const feature = {
    type: "Feature",
    properties: {
      id,
      type: data.type,
    },
    geometry: {
      type: "Point",
      coordinates: [data.featureCoordinates.lng, data.featureCoordinates.lat]
    },
  };

  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  // create new geojson based on feature
  geojson.features.push(feature);
  
  featureLayer.addData(feature);
  };

// error handling for invalid input
const invalidInputErrorHandling = () => {
  document.getElementById("drawer__error-message").style.display = "block";
  document.getElementById("drawer__error-message").innerHTML =
    "Invalid request. Please provide all the necessary informations.";

  // check which input value is invalid and change border to red
  const nameInput = document.getElementsByClassName("drawer__input")[0];
  const emailInput = document.getElementsByClassName("drawer__input")[1];
  const descriptionInput = document.getElementsByClassName(
    "drawer__input--textarea"
  )[0];

  // check if empty string

  if (nameInput.value === "") {
    nameInput.style.border = "1px solid red";
  } else {
    nameInput.style.border = "1px solid #dee0e4";
  }

  if (emailInput.value === "") {
    emailInput.style.border = "1px solid red";
  } else {
    emailInput.style.border = "1px solid #dee0e4";
  }

  if (descriptionInput.value === "") {
    descriptionInput.style.border = "1px solid red";
  } else {
    descriptionInput.style.border = "1px solid #dee0e4";
  }
};

// initialize location control object
const lc = L.control
  .locate({
    watch: true,
    enableHighAccuracy: true,
    position: "bottomright",
    setView: true,
    follow: true,
  })
  .addTo(map);

// show location and zoom to current location on load
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

// toggle pick location container
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

  // switch basemap and remove old layer
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

// switch style based on dark or light mode
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
    // show elements
    document.getElementById("light-icon").style.display = "block";
    // change text color
    document.getElementById("pick-location-container-text").style.color =
      "white";
    document.getElementById("drawer__coordinates").style.color = "white";
    // change border radius
    textArea.style.borderRadius = "5px";
    document.getElementById("filter__days-input").style.borderRadius = "5px";
  } else {
    // change mode
    document.documentElement.setAttribute("data-theme", "light");
    // change text
    currentModeElement.innerHTML = "Dark mode";
    // show elements
    document.getElementById("dark-icon").style.display = "block";
    // hide elements
    document.getElementById("light-icon").style.display = "none";
    // change text color
    document.getElementById("pick-location-container-text").style.color =
      "black";
    document.getElementById("drawer__coordinates").style.color = "black";

    // change border radius
    textArea.style.borderRadius = "0px";
    document.getElementById("filter__days-input").style.borderRadius = "0px";
  }

  // toggle mode
  currentMode === "light" ? (currentMode = "dark") : (currentMode = "light");
};

// submit filter obstruction
const submitSearch = async (event) => {
  event.preventDefault();
  // get input variables
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

  // input validation

  // invalid input: no options provided
  if (
    noDays &&
    dateStart === "" &&
    dateEnd === "" &&
    selectedTypes.length === 0
  ) {
    errorMessage = "Invalid request. Please provide filter arguments.";
  }

  // check if days specified or time range
  if (!noDays && !isDateEmpty) {
    errorMessage = "Invalid request. Specify days OR select a time range.";
  }

  // check if days or one day is specified
  if (noDays && isOneDaySpecified) {
    errorMessage =
      "Invalid request. You likely forgot to specify the time range.";
  }

  if (!isDateEmpty) {
    dateEnd = new Date(dateEnd);
    dateStart = new Date(dateStart);
  }

  // check if end date is before start date
  if (dateEnd < dateStart) {
    errorMessage = "Invalid request. Start date must be before the end date.";
  }

  // check if query is empty
  if (days === "" && selectedTypes.length === 0 && isDateEmpty) {
    emptyQuery = true;
  }

  // hide error message container if valid input vice versa
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
        "http://igf-srv-lehre.igf.uni-osnabrueck.de:41782/filterObstructions",
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

      // close filter container after successfull response
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
    if (e.style.backgroundColor !== "rgb(255, 137, 6)") {
      e.style.backgroundColor = "#ff8906"

      // add type of clicked item to selectedTypes
      selectedTypes.push(e.getAttribute("value"));
    } else {
      // filter selectedTypes and delete type of clicked item
      selectedTypes = selectedTypes.filter(
        (type) => type !== e.getAttribute("value")
      );

      e.style.backgroundColor = "#faf6f6"
    }
  }
};

// disable fixed view on user location
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
const toggleGelocation = () => {
  // change style of geolocation button and stop or start following
  if (isGeolocationActive) {
    // stop follow

    document.getElementById("gps-fixed").style.display = "none";
    document.getElementById("gps-not-fixed").style.display = "inline";

    stopGeolocation();

    lc.stopFollowing();
    isGeolocationActive = false;
  } else {
    // start follow

    document.getElementById("gps-fixed").style.display = "inline";
    document.getElementById("gps-not-fixed").style.display = "none";

    // enable fixed view on user location
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
map.on("dragend", (e) => {
  if (isGeolocationActive) {

    document.getElementById("gps-fixed").style.display = "none";
    document.getElementById("gps-not-fixed").style.display = "inline";

    stopGeolocation();

    lc.stopFollowing();
    isGeolocationActive = false;
  }
});

// take picture via cordova camera plugin
document.getElementById("drawer__take-photo").addEventListener("click", () => {
  navigator.camera.getPicture(onSuccess, onFail, {
    quality: 25,
    destinationType: Camera.DestinationType.DATA_URL,
  });

  function onSuccess(imageData) {
    image = "data:image/jpeg;base64," + imageData;

    // give user feedback after successfully capturing a photo
    document.getElementById("drawer__foto-success-message").innerHTML = "Successfully captured a photo."
    document.getElementById("drawer__take-photo").style.backgroundColor = "#60bf08"
    document.getElementById("drawer__take-photo").style.border = "2px solid #ff8e3c"
  }

  function onFail (message) {
    // give user feedback after capturing a photo failed
    document.getElementById("drawer__foto-success-message").innerHTML = "Photo capture failed. Please try again."
    document.getElementById("drawer__take-photo").style.border = "2px solid red"
  }
});

// get all obstructions
const makeGetRequest = async () => {
  try {
    const response = await axios.get(
      "http://igf-srv-lehre.igf.uni-osnabrueck.de:41782/getAllObstructions"
    );

    return response.data.rows;
  } catch (error) {
    console.error(error);
  }
};

// change html for detailed preview
const changeHTML = (data) => {
  let isFixed;
  let detailImage;

  if (data.behoben === null) {
    isFixed = "Not fixed";
  } else {
    isFixed = "Fixed";
  }

  // create date object
  let date = new Date(data.date);
  // change date to local timezone
  date = date.toLocaleDateString("de");

  // if no picture provided use placeholder photo
  if (data.photo === "undefined") {
    detailImage =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png";
  } else {
    detailImage = data.photo;
  }

  document.getElementById("clicked-marker-container__image").src = detailImage
  document.getElementById(
    "clicked-marker__content-type-preview"
  ).innerHTML = data.type;
  document.getElementById("clicked-marker__content-type").innerHTML = data.type;;
  document.getElementById("obstruction-preview__date").innerHTML = date;
  document.getElementsByClassName(
    "obstruction-showmore__date"
  )[0].innerHTML = date;
  document.getElementById("clicked-marker__content-description").innerHTML =
    data.description;
  document.getElementById("clicked-marker__content-reportedBy").innerHTML =
    data.name;
  document.getElementById("obstruction-status").innerHTML = isFixed;
};

// fetch marker after dom content loaded
document.addEventListener("DOMContentLoaded", (event) => {
  fetchMarker();
});

// toggle obstruction preview container
const toggleObstructionPreview = (featureData) => {
  const container = document.getElementById("obstruction-preview-container");
  
  // add informations to hmtl
  changeHTML(featureData);
  container.style.display = "grid";
  container.style.height = "161px";
  openObstructionPreviewContainerSwitch = true;
};

// get obstruction details by id and use informations for preview container
const clickOnFeature = async (e) => {
  try {
    const response = await axios.get(
      `http://igf-srv-lehre.igf.uni-osnabrueck.de:41782/getObstructionById/${e.target.feature.properties.id}`
    );

    clickObstructionInformations = response.data.rows[0];
    toggleObstructionPreview(clickObstructionInformations);
  } catch (error) {
    console.log(error);
  }
};

const onEachFeature = (feature, layer) => {
  // bind click
  layer.on({
    click: clickOnFeature,
  });
}

// add custom icon depending on property type
const createCustomIcons = (feature, latlng) => {
  const newIcon = {
    iconUrl: "",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  };

  let pathBeginning;

  // check running platform to adjust path to imgs
  if (window.cordova.platformId === "browser") {
    pathBeginning = "/www/img";
  } else {
    pathBeginning = "/android_asset/www/img";
  }

  // change marker icon based on type
  switch (feature.properties["type"]) {
    case "parking":
      newIcon.iconUrl = `${pathBeginning}/red_marker.jpg`;
      return L.marker(latlng, { icon: new L.icon(newIcon) });
    case "damage":
      newIcon.iconUrl = `${pathBeginning}/violet_marker.jpg`;
      return L.marker(latlng, { icon: new L.icon(newIcon) });
    case "vegetation":
      newIcon.iconUrl = `${pathBeginning}/green_marker.jpg`;
      return L.marker(latlng, { icon: new L.icon(newIcon) });
    case "object":
      newIcon.iconUrl = `${pathBeginning}/yellow_marker.jpg`;
      return L.marker(latlng, { icon: new L.icon(newIcon) });
    case "traffic_lights":
      newIcon.iconUrl = `${pathBeginning}/grey_marker.jpg`;
      return L.marker(latlng, { icon: new L.icon(newIcon) });
  }
}

// fetch marker and add to map as geoJSON with type specific items
const fetchMarker = async () => {
  const data = await makeGetRequest();
  const geojson = createGeoJSON(data);

  featureLayer = L.geoJSON(geojson, {
    pointToLayer: createCustomIcons,
    onEachFeature,
  }).addTo(map);
};

const createGeoJSON = (features) => {
  const geojson = {
    type: "FeatureCollection",
    features: [],
  };

  // loop through the markers array
  features.map((marker) => {
    // create feature
    const feature = {
      type: "Feature",
      properties: {
        id: marker.id,
        type: marker.type,
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

// remove existing features from featureLayer
const removeFeatures = () => {
  featureLayer.clearLayers();
};

// add multiple features to map
// this function will be called on initial page load (after dom content loaded)
const addFeatures = (features) => {
  removeFeatures();

  const geojson = createGeoJSON(features);

  featureLayer = L.geoJSON(geojson, {
    pointToLayer: createCustomIcons,
    onEachFeature: onEachFeature,
  }).addTo(map);
};

// detect click outside marker container to close it
document.addEventListener("click", (e) => {
  const container = document.getElementById("marker-container");

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

// toggle legend
const toggleLegend = () => {
  closeSettings();
  const container = document.getElementById("legend-container");

  if (container.style.height === "300px") {
    container.style.height = "0px";
    legendSwitch = true;
  } else {
    container.style.height = "300px";
  }
};

// close legend
const closeLegend = () => {
  document.getElementById("legend-container").style.height = "0";
};