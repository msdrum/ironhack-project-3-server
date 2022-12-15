import express from "express";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import generateToken from "../config/jwt.config.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";
import isGestor from "../middlewares/isGestor.js";
import UserModel from "../model/user.model.js";
import BookingModel from "../model/booking.model.js";
import ResourceModel from "../model/resource.model.js";

const saltRounds = 10;

const userRouter = express.Router();

const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    secure: false,
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

userRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;

    if (
      !password ||
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/gm
      )
    ) {
      return res.status(400).json({
        msg: "Email ou senha invalidos. Verifique se ambos atendem as requisições.",
      });
    }

    const salt = await bcrypt.genSalt(saltRounds);

    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.create({
      ...req.body,
      passwordHash: hashedPassword,
    });

    delete createdUser._doc.passwordHash;

    const mailOptions = {
      from: "turma92wd@hotmail.com", //nosso email
      to: email, //o email do usuário
      subject: "Ativação de Conta no reservagov",
      html: `
        <h1>Bem vindo ao incrível mundo da reserva de recursos governamentais!</h1>
        <p>Por favor, confirme seu email clicando no link abaixo.</p>
        <a href=http://localhost:8080/user/activate-account/${createdUser._id}>ATIVE SUA CONTA</a>
      `,
    };

    //envio do email
    await transporter.sendMail(mailOptions);

    return res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

userRouter.get("/activate-account/:idUser", async (req, res) => {
  try {
    const { idUser } = req.params;

    const user = await UserModel.findByIdAndUpdate(idUser, {
      confirmEmail: true,
    });

    console.log(user);

    return res.send(`Sua conta foi ativada com sucesso, ${user.name}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ msg: "Email invalido." });
    }

    if (user.confirmEmail === false) {
      return res
        .status(401)
        .json({ msg: "Usuário não confirmado. Por favor validar email." });
    }

    if (await bcrypt.compare(password, user.passwordHash)) {
      delete user._doc.passwordHash;

      const token = generateToken(user);

      return res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
          role: user.role,
        },
        token: token,
      });
    } else {
      return res.status(401).json({ msg: "Email ou senha invalidos." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

userRouter.get("/profile", isAuth, attachCurrentUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.currentUser._id).populate("resources").populate("booking")


    return res.status(200).json(req.currentUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRouter.get("/all-users", /*isAuth, isGestor,*/ async (req, res) => {
    try {
      const users = await UserModel.find({}, { passwordHash: 0 });

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

userRouter.put(
  "/edit-any/:id",
  /*isAuth, isGestor,*/ async (req, res) => {
    try {
      const { id } = req.params;

      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { ...req.body },
        { new: true, runValidators: true }
      );

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

userRouter.put("/edit", /*isAuth,*/ attachCurrentUser, async (req, res) => {
  try {
    //quem é o usuário? -> req.currentUser

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.currentUser._id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(400).json({ msg: "Usuário não encontrado!" });
    }

    //if ((await ResourceModel.find({ gestor: id })).length) {
    //  return res
    //    .status(403)
    //    .json({
    //      msg: "Usuário não pode ser deletado. Redistribuir recursos atribuidos.",
    //    });
    //}

    await BookingModel.deleteMany({ user: id });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

userRouter.get("/oneUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id)
      .populate("resources")
      .populate("booking");

    if (!user) {
      return res.status(400).json({ msg: " Usuário não encontrado!" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

// userRouter.get(
//   "/teste",
//   isAuth,
//   attachCurrentUser,
//   isAdmin,
//   async (req, res) => {
//     return res.status(200).json(req.currentUser);
//   }
// );

export default userRouter;
