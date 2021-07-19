/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
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
    console.log(e.latlng)
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

