const port = 3001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/routes");

mongoose
  .connect("mongodb://localhost:27017/hackathon")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(port, () => {
  console.log("Server running on port " + port);
});
