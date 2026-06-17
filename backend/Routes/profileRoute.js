import displayProfile from "../controller/displayProfileController.js";
import express from "express";

const profileRoute = express.Router();

profileRoute.get("/:user", displayProfile);

export default profileRoute;
