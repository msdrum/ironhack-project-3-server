import express from "express";
import BookingsModel from "../model/bookings.model.js";

const bookingsRoute = express.Router();

//ROUTES

//ROTA TESTE para agendamento
bookingsRoute.post("/booking", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

export default bookingsRoute;
