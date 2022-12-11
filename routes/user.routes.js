import express from "express";
import UserModel from "../model/user.model.js";

const userRoute = express.Router();

//ROUTES

//POST create user (sign-up)
userRoute.post("sign-up", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

export default userRoute;
