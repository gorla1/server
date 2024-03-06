const User = require("../Models/userModels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, userName } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (!email || !password || !firstName || !lastName || !userName) {
      return res.status(400).send("All fields are required");
    }
    const userCheck = await User.findOne({ email });
    if (userCheck) {
      return res.status(409).send("User already exists");
    }
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      userName,
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).send("Email and password are required");
      }
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(401).send("user not found");
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid email or password");
      }
      delete user.password;
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "7d",
        }
      )
      res.status(200).json({ user, token, refreshToken });
    } catch (error) {
      next(error);
    }
  };

const getTokenUsingRefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).send("Refresh token is required");
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).send("User not found");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

// const getAllUsers = async (req, res, next) => {
//   try {
//     //validate token and then return all users except the current user
//     const token = req.headers.authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded) {
//       return res.status(401).send("Invalid token");
//     }
//     const users = await User.find({ _id: { $ne: decoded.id } });
//     // don't send password to client
//     users.forEach((user) => {
//       delete user.password;
//     });
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    // don't send password to client
    users.forEach((user) => {
      delete user.password;
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  loginUser,
  getTokenUsingRefreshToken,
};
