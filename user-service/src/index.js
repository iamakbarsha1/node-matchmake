// for local development
const app = require("./server");

const port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
