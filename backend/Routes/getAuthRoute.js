import express from "express";
import getAuth from "../controller/getAuth.js";
import { updateData } from "../controller/getAuth.js";
const getAuthRoute = express.Router();

getAuthRoute.post("/getAuth", getAuth);
getAuthRoute.post("/update", updateData);

export default getAuthRoute;
