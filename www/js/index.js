// event listener on document
document.addEventListener("click", (e) => {
    const container = document.getElementById("basemap-container")

    // detect click outside basemap container to close it
    // check if anything without the class name "basemap" got clicked
    if (!e.target.classList.contains("basemap") && container.style.height === "160px") {
        console.log(160)
        container.style.height = "160px"
    } else {
        console.log(0)
        container.style.height = "0px"
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
    } else {
        container.style.height = "160px";
    }
}

let currentMode = "light"
// dark/light mode
const switchMode = () => {
    if (currentMode === "light") {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
    }  

    // toggle mode
    currentMode === "light" ? currentMode = "dark" : currentMode = "light"

    console.log(currentMode)


}