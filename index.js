const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const loginRouter = require("./Routes/loginRoutes");
const usersRouter = require("./Routes/userRoutes");
const messageRouter = require("./Routes/messageRoute");
const Message = require("./Models/messageModels");

// dotenv
require("dotenv").config();
const port = process.env.PORT ||  5000;
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

mongoose.set("strictQuery", false);
const dbConnection = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

dbConnection().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err) => {
  console.log(err);
});


