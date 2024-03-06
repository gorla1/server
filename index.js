const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const loginRouter = require("./Routes/loginRoutes");
const usersRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoute");
const { Server } = require("socket.io");
const Message = require("./Models/messageModels");
// dotenv
require("dotenv").config();
const port = process.env.PORT || 5000;
const uri = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());

app.use("/login", loginRouter);
app.use("/users", usersRouter);
app.use("/message", messageRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// mongoose.connect(`${uri}`,
//  {useNewUrlParser : "true"})

//  mongoose.connection.on('connected',(err,res)=>{
//      console.log('database connected')
//  })

//  mongoose.connection.on('err',(err)=>{
//      console.log(err)
//  })

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connection Successfull");
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed");
  });

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  // Disconnect
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
