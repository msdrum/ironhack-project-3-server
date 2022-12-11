import express from "express";
import UserModel from "../model/user.model.js";
import ResourceModel from "../model/resource.model.js";
import bcrypt from "bcrypt";

const userRoute = express.Router();

//ROUTES

//POST create user (sign-up)
//criando o usuário ainda sem as validaçOes e senhas, apenas para teste (os acmpos referentes à validação e senhas foram comentados no UserModel)
userRoute.post("/sign-up", async (req, res) => {
  try {
    const newUser = await UserModel.create({
      ...req.body,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRoute.get(
  "/all-users",
  /*isAuth,
  isAdmin,
  attachCurrentUser,*/
  async (req, res) => {
    try {
      const users = await UserModel.find({}, { passwordHash: 0 });

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

export default userRoute;
