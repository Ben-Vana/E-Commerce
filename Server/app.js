const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const apiRouter = require("./routes/api");

const app = express();

app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static("/public"));
app.use(
  "/public/images",
  express.static(path.join(__dirname, "/public/images"))
);
app.use("/api", apiRouter);

module.exports = app;
