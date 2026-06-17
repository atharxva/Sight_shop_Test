import express from "express";
import displayCartController from "../controller/displayCartController.js";
const displayCart = express.Router();

displayCart.get("/:user", displayCartController);

export default displayCart;
