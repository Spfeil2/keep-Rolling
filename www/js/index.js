// event listener on document
// bool for basemap control
let basemapSwitch = true;

document.addEventListener("click", (e) => {
    const container = document.getElementById("basemap-container")
    // detect click outside basemap container to close it
    // check if anything without the class name "basemap" got clicked
    if (!e.target.classList.contains("basemap") && container.style.height === "160px" && basemapSwitch != false) {
        container.style.height = "160px"
        basemapSwitch = false
    } else if (!e.target.classList.contains("basemap") && container.style.height === "160px" && basemapSwitch === false) {
        container.style.height = "0px"
        basemapSwitch = true
    } else if (e.target.classList.contains("basemap")) {
        container.style.height = "160px"
        basemapSwitch = true
    }
})

// Wait for the deviceready event before using any of Cordova's device APIs.
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

// stop showing welcome screen after 4 seconds
setTimeout(() => {
    document.getElementById("welcome-screen").style.display = "none"
}, 4000)

// filter
const openFilter = () => {
    // show filter content
    setTimeout(() => {
        document.getElementById("filter__content").style.display = "block"
    }, 300)

    // show filter
    document.getElementById("filter-container").style.width = "100%";
}

/* Set the width of the filter to 0 */
const closeFilter = () => {
    // hide filter content
    document.getElementById("filter__content").style.display = "none"

    // hide filter
    document.getElementById("filter-container").style.width = "0";
}

// drawer
const openDrawer = () => {
    // show drawer content
    setTimeout(() => {
        document.getElementById("drawer__content").style.display = "block"
    }, 300)

    // show drawer
    document.getElementById("drawer-container").style.width = "100%";
}

/* Set the width of the drawer to 0 */
const closeDrawer = () => {
    // hide drawer content
    document.getElementById("drawer__content").style.display = "none"

    // hide drawer
    document.getElementById("drawer-container").style.width = "0";
}

// setting
const openSettings = () => {
    // show settings content
    setTimeout(() => {
        document.getElementById("settings__content").style.display = "block"
    }, 300)

    // show settings
    document.getElementById("settings-container").style.width = "100%";
}

/* Set the width of the settings to 0 */
const closeSettings = () => {
    // hide settings content
    document.getElementById("settings__content").style.display = "none"

    // hide settings
    document.getElementById("settings-container").style.width = "0";
}


// map
const layer1 = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
})

const map = L.map("map", {
    center: [52.283333, 8.050000],
    zoom: 12,
    layers: [layer1]
})

// onclick events
map.on("click", (e) => {
    // console.log(e.latlng)
})

L.control.scale().addTo(map)



// zoom to current location on initial page load
navigator.geolocation.getCurrentPosition(function(location) {
    const latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);

    map.flyTo(latlng)
});


// submit form
const form = document.getElementById("drawer__form")
form.onsubmit = (e) => {    
    e.preventDefault()

    // get input values 
    const type = form.deficiency.value;
    const name = form.name.value;
    const mail = form.email.value;
    //const image = form.image.value;
    const description = document.getElementsByClassName("drawer__input--textarea")[0].value;

    const data = {
        type,
        name,
        mail,
        description
    }

    console.log(data)
}

const lc = L.control.locate({
    watch: true,
    enableHighAccuracy: true,
    position: "bottomright",
}).addTo(map);

// show marker and zoom to current location on load
lc.start();

document.getElementById("keep-rolling-new-deficiency").addEventListener("click", () => {
    console.log("test")
})

// show welcome screen on click on title
document.getElementById("keep-rolling-title").addEventListener("click", () => {
    document.getElementById("welcome-screen").style.display = "block"

    // stop showing welcome screen after 4 seconds
    setTimeout(() => {
        document.getElementById("welcome-screen").style.display = "none"
    }, 4000)
})

const toggleBasemaps = () => {
    const container = document.getElementById("basemap-container")

    if (container.style.height === "160px") {
        container.style.height = "0px";
        basemapSwitch = true
    } else {
        container.style.height = "160px";
    }
}

let currentMode = "light"
// dark/light mode
const switchMode = () => {

    let currentModeElement = document.getElementsByClassName("settings__content-inner-title")[0]

    if (currentMode === "light") {
        // change mode
        document.documentElement.setAttribute('data-theme', 'dark');
        // change text
        currentModeElement.innerHTML = "Light mode"
        // hide dark mode icon
        document.getElementById("dark-icon").style.display = "none"
        // show light mode icon
        document.getElementById("light-icon").style.display = "block"
    } else {
        // change mode
        document.documentElement.setAttribute('data-theme', 'light');
        // change text
        currentModeElement.innerHTML = "Dark mode"
        // show dark mode icon
        document.getElementById("dark-icon").style.display = "block"
        // hide light mode icon
        document.getElementById("light-icon").style.display = "none"
    }  

    // toggle mode
    currentMode === "light" ? currentMode = "dark" : currentMode = "light"
}

let selectedTypes = []
const submitSearch = (event) => {
    event.preventDefault()

    const days = event.target.days.value;
    const dateStart = event.target.start.value;
    const dateEnd = event.target.end.value;

    const searchData = {
        days,
        selectedTypes,
        date: [dateStart, dateEnd]
    }

    console.log(searchData)
}

// change color and check selected types
const filterTypes = (event) => {
    const e = event.target

    if (e.classList.value == "filter__options") {

        if (e.style.backgroundColor === "rgb(255, 137, 6)") {
            e.style.backgroundColor = "white"

            // filter selectedTypes and delete item
            selectedTypes = selectedTypes.filter(type => type !== e.getAttribute("value"))
        } else {
            e.style.backgroundColor = "#ff8906"
            e.style.boxShadow = "rgb(0 0 0 / 35%) 0px 5px 15px"
            e.style.border = "none"

            // add type to selectedTypes
            selectedTypes.push(e.getAttribute("value"))
        }
    }
}
