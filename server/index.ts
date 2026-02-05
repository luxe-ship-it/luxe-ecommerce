import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter } from "./api/auth";
import { productRouter } from "./api/products";
import { cartRouter } from "./api/cart";
import { orderRouter } from "./api/orders";
import { paymentRouter } from "./api/payment";
import { adminRouter } from "./api/admin";
import { wishlistRouter } from "./api/wishlist";
import { settingsRouter } from "./api/settings";
import { couponRouter } from "./api/coupons";
import { contactRouter } from "./api/contact";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API routes
  app.use("/api/auth", authRouter);
  app.use("/api/products", productRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/contact", contactRouter);

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  return app;
}
