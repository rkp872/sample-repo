const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect(
  `mongodb+srv://rohit872:${process.env.MONGO_ATLAS_PW}@cluster0.jk6mctc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

// Logger
app.use(morgan("dev"));

// Request body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS Error Handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-TypeError,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status | 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
