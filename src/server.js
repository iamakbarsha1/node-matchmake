const express = require("express");
const mongoose = require("mongoose");
const itemsRouter = require("./routes/itemRouter");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on AWS Lambda!" });
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use("/items", itemsRouter);

module.exports = app;
