const express = require("express");
const app = express();
const path = require("path");

const http = require("http")

const socket_io = require("socket.io");
const server = http.createServer(app);
const io = socket_io(server); 

app.set("view engine", "ejs");
console.log(path.join(__dirname, "public"))

io.on("connection", function(socket){
  console.log('A user connected');

  socket.emit("updateMyLocation", {id:socket.id} )

  socket.on("send-location", function (data){
    console.log(data)
    socket.broadcast.emit("received_location", {id:socket.id, ...data})
  });
  
  socket.on("disconnect", function () {
    io.emit("user-disconnected", socket.id);
  }) 
});

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function (req, res){
  res.render("index");
}); 

server.listen(3000);

console.log("adfadf")