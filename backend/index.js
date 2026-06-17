import cors from "cors";
import express from "express";
import connect from "./database/connection.js";
import productRouter from "./Routes/productRoute.js";
import addToCartRouter from "./Routes/CartRoute.js";
import getAuthRoute from "./Routes/getAuthRoute.js";
import checkoutRoute from "./Routes/checkoutRoute.js";
import searchbarRoute from "./Routes/searchbarRoute.js";
import displayCart from "./Routes/displayCartRoute.js";
import profileRoute from "./Routes/profileRoute.js";
import addressInputRoute from "./Routes/addressInputRoute.js";
import router from "./Routes/payment.router.js";
import Razorpay from "razorpay";
import dev from "./config/config.js";
import AppointmentRoute from "./Routes/appointmentRoutes.js";
import doctorRoute from "./Routes/doctorRoutes.js";
import { graphqlHTTP } from "express-graphql";
import { schema, root } from "./graphql/schema.js";
import jwt from "jsonwebtoken";
import adminRoutes from "./routes/adminRoutes.js";
import UserModel from "./database/datamodels/user.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);
app.use("/addtocart", addToCartRouter);
app.use("/", getAuthRoute);
app.use("/search", searchbarRoute);
app.use("/cart", displayCart);
app.use("/profile", profileRoute);
app.use("/checkout", checkoutRoute);
app.use("/address", addressInputRoute);
app.use("/api", router);
app.use("/api/appointments", AppointmentRoute);
app.use("/api/doctors", doctorRoute);
app.use("/api/admin", adminRoutes);

const secretKey = "hF9z!@vP3xQeL#2XbGpN6kT%yR4uM8*cW7&J5dA-Zo1Y$V_K@tBm";

///admin auth middleware
app.use((req, res, next) => {
  const token = req.headers.authorization || "";
  try {
    const decoded = jwt.verify(token, secretKey);
    req.isAdmin = decoded.role === "admin";
  } catch (error) {
    req.isAdmin = false;
  }
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

app.get("/api/getkey", (req, res) => {
  res.status(200).json({
    keyId: dev.KEY_ID,
  });
});

export const instance = new Razorpay({
  key_id: dev.KEY_ID,
  key_secret: dev.KEY_SECRET,
});

connect();

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
