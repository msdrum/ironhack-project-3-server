import express from "express";
import ResourceModel from "../model/resource.model.js";
import UserModel from "../model/user.model.js";
import BookingsModel from "../model/bookings.model.js";

const resourceRoute = express.Router();

//ROUTES

//POST create-resource

// resourceRoute.post(
//   "/create-resource",
//   /*isAuth, attachCurrentUser,*/ async (req, res) => {
//     try {
//       const newResource = await ResourceModel.create({
//         ...req.body,
//         gestor: req.currentUser._id,
//       });

//       const userUpdated = await UserModel.findByIdAndUpdate(
//         req.currentUser._id,
//         {
//           $push: {
//             resources: newResource._id,
//           },
//         },
//         { new: true, runValidators: true }
//       );

//       await BookingsModel.create({
//         user: req.currentUser._id,
//         resource: newResource._id,
//         status: "Pendente", //rever o status
//       });

//       return res.status(201).json(newResource);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json(error.errors);
//     }
//   }
// );

//ROTA TESTE criar um novo Resource e alocá-lo para um gestor.
resourceRoute.post("/create-resource/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //Criando o novo resource na collection e conectando a um gestor utilizando o Id do gestor (já existente)

    const newResource = await ResourceModel.create({
      ...req.body,
      gestor: userId,
    });

    //Colocar a nova resource no campo resources do usuário (gestor)
    const userUpdated = await UserModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          resources: newResource._id,
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(201).json(newResource);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

//get all-resources
resourceRoute.get("/all-resources", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

export default resourceRoute;
