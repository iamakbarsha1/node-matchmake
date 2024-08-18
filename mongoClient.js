const { MongoClient } = require("mongodb");

let client = null;

const connectToMongoDB = async () => {
  if (!client) {
    console.time("MongoDB Connection Time"); // Start timer
    client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
    console.timeEnd("MongoDB Connection Time"); // End timer
    console.log("MongoDB connected!");
  } else {
    console.log("DB connection failed!");
  }

  return client;
};

module.exports = { connectToMongoDB };
