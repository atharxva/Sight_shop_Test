import addressInputController from "../controller/addressInputController.js";
import express from "express";

const addressInputRoute = express.Router();

addressInputRoute.put("/:user", addressInputController);

export default addressInputRoute;