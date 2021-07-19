const layer1 = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
})

const map = L.map("map", {
    center: [52.283333, 8.050000],
    zoom: 12,
    layers: [layer1]
})

const onSuccess = function(position) {
  console.log(position.coords.latitude, position.coords.longitude)

  L.marker([position.coords.latitude,  position.coords.longitude]).addTo(map);
};

function onError(error) {
  alert(error.code, error.message);
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);


// onclick events
map.on("click", (e) => {
    console.log(e.latlng)
})

L.control.scale().addTo(map)


/* Set the width of the drawer to 100% */
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

/* Set the width of the drawer to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}



  
