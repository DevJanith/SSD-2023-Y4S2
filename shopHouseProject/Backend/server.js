import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

//import routes
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

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.initialize());
app.use(passport.session());
//swagger
// const swaggerOptions = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Shop House REST API",
//       description:
//         "A REST API built with Express and MongoDB. This API provides Shop House Rest API's.",
//       version: "0.0.1",
//     },
//     servers: [
//       {
//         url: "http://localhost:8000/",
//         description: "Shop House API's",
//       },
//     ],
//   },
//   apis: ["./routes/*.js"],
// };
// const swaggerDocs = swaggerJSDoc(swaggerOptions);
// app.use(
//   "/shop-house/swagger-ui",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocs)
// );

// app.get("/shop-house/swagger-doc", (req, res) => {
//   res.send(swaggerDocs);
// });
//end

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

const CONNECTION_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.46vukap.mongodb.net/?retryWrites=true&w=majority`;
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
