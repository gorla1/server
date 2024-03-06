const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const loginRouter = require("./Routes/loginRoutes");
const usersRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoute");
// const { Server } = require("socket.io");
const Message = require("./Models/messageModels");
// dotenv
require("dotenv").config();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${uri}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


connectDB().then(() => {
  app.listen(port, () => {
      console.log("listening for requests");
  });
}).catch((err) => {
  console.log(err);
});

// const server = app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

// const io = new Server(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);
//   // Disconnect
//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });
