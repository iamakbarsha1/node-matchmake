const express = require("express");
const mongoose = require("mongoose");
const UserRouter = require("./routes/userRouter");
const ItemRouter = require("./routes/itemRouter");
require("dotenv").config();
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config({
//     path: `.env.${process.env.NODE_ENV}`,
//   });
// }

const port = 7000 || process.env.PORT;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on AWS Lambda - user-service!" });
});

console.log("process.env.MONGODB_URI_LOCAL: " + process.env.MONGODB_URI_LOCAL);
console.log("process.env.NODE_ENV: " + process.env.NODE_ENV);
// MongoDB connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(
        process.env.MONGODB_URI,
        // process.env.NODE_ENV !== "prod"
        //   ? process.env.MONGODB_URI_LOCAL
        //   : process.env.MONGODB_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("Could not connect to MongoDB...", err);
    }
  }
};

// Connect to database and use routes
connectToDatabase();

app.use("/items", ItemRouter);
app.use("/user", UserRouter);

app.listen(port, (res, err) => {
  if (err) return console.log("Server Down!😲");
  else {
    console.log(`Server Up & Running on http://localhost:${port}/`);
    console.log(`Running in ${process.env.NODE_ENV} environment`);
  }
});

// MongoDB.connect(process.env.MONGODB_URI)
//   .then((res) => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB...", err));

module.exports = app;
