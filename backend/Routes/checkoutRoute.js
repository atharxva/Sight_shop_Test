import express from "express";
import checkoutController from "../controller/checkoutController.js";

const checkoutRoute = express.Router();

checkoutRoute.get("/:user", checkoutController);

export default checkoutRoute;