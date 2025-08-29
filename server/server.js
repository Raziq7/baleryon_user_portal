import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";

import connect from "./connect/connect.js";
import { errorHandler, notFound } from "./middlewares/errorMiddlware.js";
import productRouter from "./routes/productRouter.js";
import authRouter from "./routes/authRouter.js";
import cartRouter from "./routes/cartRouter.js";
import wishlistRouter from "./routes/wishlistRouter.js";
import orderRouter from "./routes/orderRouter.js";
import settingRouter from "./routes/settingRouter.js";
import userProfileRouter from "./routes/userRoutes.js";
import sanitizedConfig from "./config.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies to be sent from the frontend
  })
);

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: sanitizedConfig.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (optional)
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  })
);

MongoStore.create({
  mongoUrl: sanitizedConfig.MONGO_URI,
})
  .on("connect", () => {
    console.log("MongoDB session store connected");
  })
  .on("error", (err) => {
    console.error("MongoDB session store error:", err);
  });

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// db Connectig
connect().then(() => console.log("DB connected"));

// app.use("/api/auth/", authRouter);
app.use("/api/user/product/", productRouter);
app.use("/api/user/auth", authRouter);
app.use("/api/user/cart/", cartRouter);
app.use("/api/user/wishlist/", wishlistRouter);
app.use("/api/user/order/", orderRouter);

// settigs
app.use("/api/user/setting", settingRouter);

// user profile
app.use("/api/user", userProfileRouter);

// app.get("/", (req, res) => {
//   res.send("API is running!");
// });

let dirname = path.resolve();


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(dirname, "../client", "dist")));
  
  app.get("*", (req, res) => {
    console.log(dirname,"process.env.NODE_ENVprocess.env.NODE_ENVprocess.env.NODE_ENV");
    res.sendFile(path.join(dirname, "../client", "dist", "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = sanitizedConfig.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
