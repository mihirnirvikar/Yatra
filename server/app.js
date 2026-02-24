const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db/db");
const userRouter = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

// middleware to parse json, cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// connect to database
connectDB();

// routes
app.use("/api/user", userRouter);

// default route
app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
