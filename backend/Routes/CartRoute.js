import express from "express";
import addToCartController from "../controller/CartController.js";
const addToCartRouter = express.Router();

addToCartRouter.post("/", addToCartController);

export default addToCartRouter;
