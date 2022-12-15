import express, { Router } from "express";
import isGestor from "../middlewares/isGestor.js";
import ResourceModel from "../model/resource.model.js";
import UserModel from "../model/user.model.js";
import BookingModel from "../model/booking.model.js";
import isAuth from "../middlewares/isAuth.js";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const resourceRoute = express.Router();

//ROUTES

//POST create-resource

//  resourceRoute.post(
//   "/create-resource",
//   isAuth, attachCurrentUser, async (req, res) => {
//     try {
//        const newResource = await ResourceModel.create({
//         ...req.body,
//         gestor: req.currentUser._id,
//        });

//        const userUpdated = await UserModel.findByIdAndUpdate(
//          req.currentUser._id,
//          {
//            $push: {
//              resources: newResource._id,
//            },
//        },
//         { new: true, runValidators: true }
//       );
//        await BookingsModel.create({
//         user: req.currentUser._id,
//         resource: newResource._id,
//         status: "Pendente", //rever o status
//       });

//       return res.status(201).json(newResource);
//      } catch (error) {
//       console.log(error);
//        return res.status(500).json(error.errors);
//     }
//   }
//  );

//ROTA TESTE criar um novo Resource e alocá-lo para um gestor.

resourceRoute.post("/create-resource/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //Criando o novo resource na collection e conectando a um gestor utilizando o Id do gestor (já existente)

    const newResource = await ResourceModel.create({
      ...req.body,
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
    return res.status(500).json(error.erros);
  }
});
/*
// Criar Recursos (incluir para avaliação do grupo- 15h41)
resourceRoute.post(
  "/create-resource",
/*isAuth, isGestor,
 attachCurrentUser,
  async (req, res) => {
    try {
      const newResource = await ResourceModel.create({
        ...req.body,
        gestor: req.currentGestor._id,
      });

      const userUpdated = await UserModel.findByIdAndUpdate(
        req.currentUser._id,{
          $push: {
            resource: newResource._id,
          },
        },
        { new: true, runValidators: true });

      await LogModel.create({
        user: req.currentUser._id,
        resource: newResource._id,
        status: "Um novo recurso foi adicionado",});

      return res.status(201).json(newResource);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);
*/
//get all-resource

resourceRoute.get(
  "/my-resource",
  /* isAuth,
  isGestor,
  attachCurrentUser,*/
  async (req, res) => {
    try {
      const allResource = await ResourceModel.find({
        user: req.currentUser._id,
      }).populate("gestor");

      return res.status(200).json(allResource);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

//update-resource

resourceRoute.put(
  "/edit/:idResource",
  /*isAuth,
  isGestor,
  attachCurrentUser,*/
  async (req, res) => {
    try {
      const { idResource } = req.params;

      const updatedResource = await ResourceModel.findOneAndUpdate(
        { _id: idResource },
        { ...req.body },
        { new: true, runValidators: true }
      );


      return res.status(200).json(updatedResource);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

//delete-resource

resourceRoute.delete(
  "/delete/:idResource",
  /*isAuth,
  isGestor,
  attachCurrentUser,*/
  async (req, res) => {
    try {
      const { idResource } = req.params;

      //deletei o recurso
      const deletedResource = await ResourceModel.findByIdAndDelete(idResource);

      //retirei o id do recurso de dentro da minha array recurso
      await UserModel.findByIdAndUpdate(
        deletedResource.user,
        {
          $pull: {
            Resources: idResource,
          },
        },
        { new: true, runValidators: true }
      );

      

      return res.status(200).json(deletedResource);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

//editar-resource

resourceRoute.put(
  "/complete/:idResource",
  /*isAuth,
  isGestor,
  attachCurrentUser,*/
  async (req, res) => {
    try {
      const { idResource } = req.params;

      const resource = await ResourceModel.findByIdAndUpdate(
        idResource,
        { complete: true, dateFin: Date.now() },
        { new: true, runValidators: true }
      );

      await LogModel.create({
        user: req.currentUser._id,
        resource: idResource,
        status: `A edição "${resource.details}" foi concluída!!`,
      });

      return res.status(200).json(resource);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error.errors);
    }
  }
);

//all-resource (incluir para avaliação do grupo- 15h41)
resourceRoute.get("/all-resource", async (req, res) => {
  try {
    const allResource = await ResourceModel.find({}).populate("gestor");
    console.log(allResource);

    return res.status(200).json(allResource);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.errors);
  }
});

export default resourceRoute;
