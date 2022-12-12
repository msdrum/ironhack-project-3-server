import express from "express";
import BookingModel from "../model/booking.model.js";

const bookingRoute = express.Router();

//ROUTES

//ROTA TESTE para agendamento
bookingRoute.post("/booking", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

export default bookingRoute;
