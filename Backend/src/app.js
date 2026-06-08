import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth20"
import { config } from "./config/config.js";

import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js"




dotenv.config();

const app = express();

// MIDDLEWARES
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "http://localhost:3000/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
app.use(cookieParser());

app.use(morgan("dev"));




// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart",cartRouter)


export default app;