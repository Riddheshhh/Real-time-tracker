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