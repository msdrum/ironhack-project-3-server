import express from "express";
import ResourceModel from "../model/resource.model.js";
import UserModel from "../model/user.model.js";
import BookingsModel from "../model/bookings.model.js";

const resourceRoute = express.Router();

//ROUTES

//post create-resource

resourceRoute.post(
  "/create-resource",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {
      const newResource = await ResourceModel.create({
        ...req.body,
        gestor: req.currentUser._id,
      });

      const userUpdated = await UserModel.findByIdAndUpdate(
        req.currentUser._id,
        {
          $push: {
            resources: newResource._id,
          },
        },
        { new: true, runValidators: true }
      );

      await BookingsModel.create({
        user: req.currentUser._id,
        resource: newResource._id,
        status: "Pendente", //rever o status
      });

      return res.status(201).json(newResource);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//get all-resource

resourceRoute.get(
  "/my-resource",
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const allResource = await ResourceModel.find({
        user: req.currentUser._id,
      }).populate("user");

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
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idResource } = req.params;

      const updatedResource = await ResourceModel.findOneAndUpdate(
        { _id: idResource },
        { ...req.body },
        { new: true, runValidators: true }
      );

      await LogModel.create({
        user: req.currentUser._id,
        Resource: idResource,
        status: `O recurso  "${updatedTask.details}" foi atualizado.`,
      });

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
  isAuth,
  attachCurrentUser,
  async (req, res) => {
    try {
      const { idResource } = req.params;

      //deletei o recurso
      const deleteResource = await ResourceModel.findByIdAndDelete(idResource);

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

      await LogModel.create({
        Resource: idResource,
        user: req.currentUser._id,
        status: `O recurso "${deletedResource.details}" foi excluída com o status ${deletedResource.status}.`,
      });

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
  isAuth,
  attachCurrentUser,
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

export default resourceRoute;
