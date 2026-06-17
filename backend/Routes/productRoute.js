import express from "express";
import displayProduct from "../controller/productController.js";
const productRouter = express.Router();

productRouter.get("/", displayProduct);
productRouter.get("/:id", displayProduct);

export default productRouter;
