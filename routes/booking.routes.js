import express from "express";
import BookingModel from "../model/booking.model.js";
import ResourceModel from "../model/resource.model.js";
import { ObjectId } from "mongodb";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const bookingRoute = express.Router();

//ROUTES

//ROTA NEW Booking
bookingRoute.post(
  "/new",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {
      const newBooking = await BookingModel.create({
        ...req.body,
      });
      return res.status(200).json(newBooking);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//ROTA DA DISPONIBILIDADE DE HORÁRIOS DO RECURSO

bookingRoute.post(
  "/availability",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {
      console.log("body recebido:", req.body);
      if (!req.body) return ("Body nao recebido");

      //arrumando a data consultada, vinda do front (ex: 2022-12-14)
      const dateFront = req.body.schedule;
      const dateArray = dateFront.split("-");
      const day = +dateArray[2];
      const month = +dateArray[1] - 1; //-> mes começa com 0
      const year = +dateArray[0];

      //criando objeto do tipo Date
      const date = new Date(year, month, day);
      console.log(date);

      /** descobrir qual dia da semana usando getDay() 
      (12/12/2022) --> 1 segunda
      (13/12/2022) --> 2 terça
      (14/12/2022) --> 3 quarta
      (15/12/2022) --> 4 quinta
      (16/12/2022) --> 5 sexta    */
      const week = date.getDay();
      console.log(week, typeof week);

      //criando expressao regular para filtrar pelo dia da semana
      const regexWeek = new RegExp(`^${week}`);
      console.log(regexWeek, typeof regexWeek);

      /**
       * Resource - encontrando pelo ID do resource
       */
      const resource = req.body.resource;
      //console.log(resource);

      const resourceToBook = await ResourceModel.findById(resource).populate(
        "gestor"
      );
      console.log("Recurso a ser reservado:", resourceToBook);

      //criando expressao regular para filtrar data escolhida na collection booking
      const regexDate = new RegExp(`^${dateFront}`);
      console.log(regexDate, typeof regexDate);

      //buscando reservas do dia escolhido
      const booked = await BookingModel.find({
        $and: [
          {
            resource: new ObjectId(resource),
          },
          {
            schedule: {
              $in: [regexDate],
            },
          },
        ],
      });
      console.log("Reservas encontradas para a data ", dateFront, ": ", booked);

      //
      const allHours = resourceToBook.availableBooking
        .filter((hour) => {
          return +hour[0] === week;
        })
        .map((hour) => {
          return hour.split(" ")[1];
        });

      console.log(allHours);

      /**
       * para cada hora, buscar na collection Booking se há reserva,
       * caso exista, consultar collection Bookings filtrando pela data (ex. 12-12-2022),
       * pelo status !reservado e pelo horário (12-12-2022 1 09:00)
       * */
      const hoursReserved = booked.map((element) => {
        return element.schedule.split("-")[3];
      });

      //se horário estiver disponível, mostrar
      //se horário estiver indisponível, não mostrar
      const freeHours = allHours.filter((hour) => {
        return !hoursReserved.includes(hour);
      });

      return res.status(200).json(freeHours);   

    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//MINHAS RESERVAS --> reservas do usuario
bookingRoute.get(
  "/my-bookings/:userId",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {
      const { userId } = req.params;

      const myBookings = await BookingModel.find({
        user: new ObjectId(userId),
      })
        .populate("user")
        .populate("resource");

      if (!myBookings) {
        return res
          .status(400)
          .json({ msg: "Não existem agendamentos para este usuário!" });
      }

      return res.status(200).json(myBookings);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//Reservas dos recursos do gestor
bookingRoute.get(
  "/gestor-bookings/:gestorId",
  /*isAuth, attachCurrentUser, isGestor*/ async (req, res) => {
    try {
      const { gestorId } = req.params;

      const bookings = await BookingModel.find({ gestor: gestorId }).populate("gestor");
      console.log(bookings);

      if (!bookings) {
        return res
          .status(400)
          .json({ msg: "Não existem agendamentos para este gestor!" });
      }

      return res.status(200).json(bookings);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//ROTA PARA EDITAR UMA RESERVA
bookingRoute.put(
  "/edit/:bookingId",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {

      const { bookingId } = req.params;

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        { _id: bookingId },
        { ...req.body },
        { new: true, runValidators: true }
      );
      return res.status(200).json(updatedBooking);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//ROTA PARA APROVAR UMA RESERVA
bookingRoute.put(
  "/aprove/:bookingId",
  /*isAuth, attachCurrentUser, isGestor*/ async (req, res) => {
    try {

      const { bookingId } = req.params;

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        { _id: bookingId },
        { status: "Reservado" },
        { new: true, runValidators: true }
      );
      return res.status(200).json(updatedBooking);

    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);


//ROTA PARA CANCELAR UMA RESERVA (DELETE)
bookingRoute.delete(
  "/delete/:bookingId",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {
      const { bookingId } = req.params;
      const deletedBooking = await BookingModel.findByIdAndDelete(bookingId);
      if (!deletedBooking) {
        return res.status(400).json({ msg: "Agendamento não encontrado!" });
      }

      return res.status(200).json({ msg: "Agendamento cancelado!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

//ROTA PARA VERIFICAR TODAS AS RESERVAS FEITAS
bookingRoute.get(
  "/all",
  /*isAuth, attachCurrentUser, isGestor*/ async (req, res) => {
    try {

      const allBookings = await BookingModel.find({ })
        .populate("user")
        .populate("resource");

      if (!allBookings) {
        return res
          .status(400)
          .json({ msg: "Não existem reservas!" });
      }

      return res.status(200).json(allBookings);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);

export default bookingRoute;
