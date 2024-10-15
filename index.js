require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const { clerkMiddleware, requireAuth } = require('@clerk/express');
const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handling");

app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(express.json());
app.use(clerkMiddleware());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100
});

app.use(limiter);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const authRouter = require('./routes/authRoute');
app.use("/api/v1/auth", authRouter);

//Example of a protected route
// app.get("/protected", requireAuth(), (req, res) => {
//   res.send("Hello from protected route");
// });

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("connected to db");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
