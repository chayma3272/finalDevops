const express = require("express");
const dotenvFlow = require("dotenv-flow");
const todoRoutes = require("./routes/todoRoutes");
const cors = require("cors");

// dotenv-flow is used to manage environment variables across different environments
dotenvFlow.config();

const app = express();

// allow requests from outside resources like postman, or your frontend if you choose to build that out
app.use(cors());

// app will serve and receive data in a JSON format
app.use(express.json());

// the messenger between our app and our database
const mongoose = require("mongoose");
const { baseRoot } = require("./controllers/todoController");

// establish connection & give yourself a message so you know when its complete
const source = process.env.MONGODB_ATLAS_CONNECTION;

mongoose
  .connect(source)
  .then(() => console.log("✅ DB Connected Successfully"))
  .catch((error) => console.log(error));

app.get("/", baseRoot);

app.use("/api", todoRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
