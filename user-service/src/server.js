const express = require("express");
const itemsRouter = require("./routes/itemRouter");
const UserRouter = require("./routes/userRouter");
const { connectToMongoDB } = require("../../mongoClient");
require("dotenv").config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on AWS Lambda!" });
});

app.use("/items", itemsRouter);
app.use("/user", UserRouter);

app.use(async (req, res) => {
  try {
    // Initialize MongoDB connection using the singleton pattern
    const client = await connectToMongoDB();
    req.mongoClient = client; // Attach MongoDB client to the request object
    next();
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB"); // Start server locally
//   })
//   .catch((err) => console.error("Could not connect to MongoDB...", err));

// local server setup
if (process.env.NODE_ENV !== "lambda") {
  const port = process.env.PORT || 7000;

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
