require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const PORT = process.env.PORT || 2000;
const connectDB = require("./config/db");
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});

const allowedOrigins = [
  "http://localhost:5173", // for local React dev
  "https://medical-center-tawny.vercel.app", // your Vercel link
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day session expiration
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", require("./routes/main"));

connectDB();

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
