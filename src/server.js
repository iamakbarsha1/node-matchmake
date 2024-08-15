const express = require("express");
const mongoose = require("mongoose");
const itemsRouter = require("./routes/itemRouter");
const UserRouter = require("./routes/userRouter");
require("dotenv").config();

const port = 7000;

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
  .then(() => {
    console.log("Connected to MongoDB"); // Start server locally
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.use("/items", itemsRouter);
app.use("/user", UserRouter);

module.exports = app;
