const socket = io();

if(navigator.geolocation){
  navigator.geolocation.watchPosition(

    (position)=>{
      const {latitude, longitude} =  position.coords;
      console.log({latitude, longitude})
      socket.emit("send-location", {latitude, longitude});  
    }, 
    (error)=>{
      console.log(error)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );   
}


const map = L.map("map").setView([0,0], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'tracking via leaflet-cdn'
}).addTo(map);

const markers = {}


socket.on("received_location", (data) =>{
  const{id, latitude, longitude} = data;
  console.log(data)
  map.setView([latitude, longitude], 25);

  if(markers[id]){
    markers[id].setLatLng([latitude, longitude])
  }
  else{
    markers[id] = L.marker([latitude,longitude]).addTo(map);
  }
});


socket.on("user-disconnected", (id) => {
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id]
  };
});




// rotating implementation for the map.
let rotatingAngle = 0;
let isRotating = false;
let startAngle = 0;

//mouse down/touch start to initate rotation.
map.getContainer().getEventListener("mousedown", (e) => {
  isRotating = true;
  startAngle = e.clientX;
});

map.getContainer().getEventListener("mousemove", (e) =>{
  if(isRotating){
    const currentAngle = e.clientX;
    const angleChange = currentAngle - startAngle;
    rotatingAngle =+ angleChange * 0.1;
    map.getContainer().style.transform = `rotate(${rotationAngle}deg)`;
    startAngle = currentAngle;
  };
});

// stopping rotation on mouseup event.
document.addEventListener("mouseup",() =>{
  isRotating = false;
});

// touch support for rotation.
map.getContainer().getEventListener("touchstart", (e) =>{
  if(e.touches.length === 1){
    isRotating = true;
    startAngle = e.touches[1].clientX;
  }
});

map.getContainer().getEventListener("touchmove", (e)=>{
  if(isRotating && e.touches ===1){
    const currentAngle = e.touches[0].clientX;
    const angleChange = currentAngle - startAngle;
    rotatingAngle =+ angleChange * 0.1;
    map.getContainer().style.transform = `rotate${rotatingAngle}deg`;
    startAngle = currentAngle;
  }
});

map.getContainer().getEventListener("touchend", ()=> {
  isRotating = false;
});
