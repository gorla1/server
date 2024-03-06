const Message = require("../Models/messageModels");
const jwt = require("jsonwebtoken");

const addMessage = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send("Invalid token");
    }
    const { receiver, message } = req.body;
    const sender = decoded.id;
    if (!receiver || !message || !sender) {
      return res.status(400).send("All fields are required");
    }
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
    });
    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).send("Invalid token");
    }
    const { id } = req.params;
    const messages = await Message.find({
      $or: [{ sender: id }, { receiver: id }],
    });
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMessage,
  getAllMessages,
};
