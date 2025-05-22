require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 2000;
const connectDB = require("./config/db");
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
store.on("error", function (error) {
  console.error("SESSION STORE ERROR:", error);
});
app.set("trust proxy", 1);
const allowedOrigins = [process.env.FRONTEND_URL, process.env.BACKEND_URL];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === "production";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax", // 👈 Dynamic fix
      secure: isProduction, // 👈 Only secure in production
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/", require("./routes/main"));
app.set("io", io);

connectDB();

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
