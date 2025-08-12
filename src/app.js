// import external
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import "dotenv/config";
import session from "express-session";
import cors from "cors";
import cookieParser from 'cookie-parser';

// Import internal
import { db } from "./config/db.js";
import route from "./routes/index.js";

const port = process.env.PORT;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// app session
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "somesecret",
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

// HTTP Logger - morgan
app.use(morgan("combined"));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Connection database
db.connectDB();

// app.use(cookieParser());

// route
route(app);

app.get("/", (req, res) => {
  res.send("App begining1");
});

// Server listen
app.listen(port, (req, res) => {
  console.log(`App listening on localhost: ${port}`);
});
