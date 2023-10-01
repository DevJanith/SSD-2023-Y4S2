import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import feedbackRoutes from "./routes/feedback.routes.js";
import itemRoutes from "./routes/item.routes.js";
import productRoutes from "./routes/product.routes.js";
import tutorialRoutes from "./routes/tutorial.routes.js";
import userRoutes from "./routes/user.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import authRoutes from "./routes/auth.js";
import cookieSession from "cookie-session";
import passport from "passport";
import passportSetup from "./passport.js";
dotenv.config();
const app = express();
const allowedOrigins = ["https://localhost:3000", "http://localhost:3000"]; // Replace with the desired allowed origin(s)
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors(corsOptions));
// app.use(cors());
// const app = express();
import fs from "fs";
import morgan from "morgan";

const accessLogStream = fs.createWriteStream("./logs/access.log", {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));

// Define a route for logging user activities
app.post("/log-activity", async (req, res) => {
  const { _id, userEmail, userName, type, activity } = req.body;

  try {
    const userActivity = new UserActivity({
      _id,
      userEmail: result.userDetails.userEmail,
      userName: result.userDetails.userName,
      type,
      activity,
    });

    await userActivity.save();
    res.status(200).send("Activity logged successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging activity");
  }
});

// app.use(bodyParser.json({ limit: '30mb', extended: true }));
// app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
// app.use(cors());
app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Shop House Server" });
});

app.use("/shop-house/tutorial", tutorialRoutes);
app.use("/shop-house/user", userRoutes);
app.use("/shop-house/feedback", feedbackRoutes);
app.use("/shop-house/item", itemRoutes);
app.use("/shop-house/product", productRoutes);
app.use("/shop-house/payment", paymentRoutes);
app.use("/auth", authRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
// const CONNECTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.46vukap.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server Running on port :http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.log(error.message);
  });
