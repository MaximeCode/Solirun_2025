const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(); // Création d'un serveur HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // ✅ Autoriser React/Next.js
    methods: ["GET", "POST"]
  }
});

let isRunning = false;

let classes = [];

io.on("connection", (socket) => {
  console.log("Un client s'est connecté");

  socket.emit("updateIsRunning", isRunning);
  socket.emit("updateClasses", classes);

  socket.on("toggleIsRunning", async () => {
    isRunning = !isRunning;
    console.log("isRunning:", isRunning);
    io.emit("updateIsRunning", isRunning);

    await new Promise((resolve) => setTimeout(resolve, 10)); 
    io.emit("updateClasses", classes);
  });
  
  socket.on("setClasses", (newClasses) => {
    classes = newClasses;
  });

  socket.on("updateTours", ({ id, increment }) => {
    if (classes[id]) {
      classes[id].laps += increment;
      if (classes[id].laps < 0) classes[id].laps = 0; // Empêcher valeurs négatives
      console.log("classes:", classes[id].name, "prend :", increment);
      io.emit("updateClasses", classes);
    }
  });

  socket.on("disconnect", () => console.log("Client déconnecté"));
});

server.listen(5000, () => {
  console.log("Serveur WebSocket en écoute sur http://localhost:5000");
});
