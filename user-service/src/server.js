const express = require("express");
const mongoose = require("mongoose");
const itemsRouter = require("./routes/itemRouter");
const UserRouter = require("./routes/userRouter");
require("dotenv").config();

const port = 7000 || process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on AWS Lambda - user-service!" });
});

// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Could not connect to MongoDB...", err);
    }
  }
};

// Connect to database and use routes
connectToDatabase();

app.use("/items", itemsRouter);
app.use("/user", UserRouter);

app.listen(port, (res, err) => {
  if (err) return console.log("Server Down!😲");
  else return console.log(`Server Up & Running on http://localhost:${port}/`);
});

// MongoDB.connect(process.env.MONGODB_URI)
//   .then((res) => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB...", err));

module.exports = app;
