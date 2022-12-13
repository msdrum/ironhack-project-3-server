import express from "express";
import BookingModel from "../model/booking.model.js";
import ResourceModel from "../model/resource.model.js";
import { ObjectId } from "mongodb";
import attachCurrentUser from "../middlewares/attachCurrentUser.js";

const bookingRoute = express.Router();

//ROUTES

//ROTA TESTE para agendamento
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
});

//ROTA DA DISPONIBILIDADE DE HORÁRIOS DO RECURSO

bookingRoute.get(
  "/availability",
  /*isAuth, attachCurrentUser,*/ async (req, res) => {
    try {
      //arrumando a data consultada, vinda do front (ex: 14-12-2022)
      const dateFront = req.body.schedule;
      const dateArray = dateFront.split("-");
      const day = +dateArray[0];
      const month = +dateArray[1] - 1; //-> mes começa com 0
      const year = +dateArray[2];

      //criando objeto do tipo Date
      const date = new Date(year, month, day);
      console.log(date);

      /** descobrir qual dia da semana usando getDay() 
      (12/12/2022) --> 1 segunda
      (13/12/2022) --> 2 terça
      (14/12/2022) --> 3 quarta
      (15/12/2022) --> 4 quinta
      (16/12/2022) --> 5 sexta
    */
      const week = date.getDay();
      console.log(week, typeof week);

      //criando expressao regular para filtrar pelo dia da semana
      const regexWeek = new RegExp(`^${week}`);
      console.log(regexWeek, typeof regexWeek);

      /**
       * Resource - encontrando pelo ID do resource
       */
      const resource = req.body.resource;
      console.log(resource);

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

      const freeHours = allHours.filter((hour) => {
        console.log(hour);

        return !hoursReserved.includes(hour);
      });

      /*
    //consultar o availableBooking do Resource se existe nesse dia da semana
    const hoursAvailable = await ResourceModel.
      find(
        {
          resource: {
            $eq: resource
          },
          availableBooking: {
            $in: [regex]
          }
        },
        {
          name: 1,
          availableBooking: 1
        }
      );  
    

    const newArray = hoursAvailable.map( (resource) => {

      const hours = resource.availableBooking.filter( (hour) => {
        
        //para cada hora, buscar na collection Booking se há reserva
        //caso exista, consultar collection Bookings filtrando pela data (12/12/2022), pelo status !reservado e pelo horário (12/12/2022 1 09:00)

        return +hour[0] === diaSemana;
      })
      console.log(hours);

      return {_id: resource._id, 
              name: resource.name,
              availableBooking: hours}
    })
    */

      return res.status(200).json(freeHours);

      //caso exista, consultar collection Bookings filtrando pela data (12/12/2022), pelo status !reservado e pelo horário (12/12/2022 1 09:00)

      //se horário estiver disponível, mostrar

      //se horário estiver indisponível, não mostrar
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

      const myBookings = await BookingModel.find(
        {
          user: new ObjectId(userId)
        }
      ).populate("user").populate("resource");
      
      if (!myBookings) {
        return res.status(400).json({ msg: "Não existem agendamentos para este usuário!" });
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
  "/gestor-bookings",
  /*isAuth, attachCurrentUser, isGestor*/ async (req, res) => {
    try {


      // const { bookingId } = req.params;
      // const deletedBooking = await BookingModel.findByIdAndDelete(bookingId);
      // if (!deletedBooking) {
      //   return res.status(400).json({ msg: "Agendamento não encontrado!" });
      // }

      return res.status(200).json({ msg: "Agendamento cancelado!" });


    } catch (error) {
      console.log(error);
      return res.status(500).json(error.errors);
    }
  }
);


//ROTA PARA EDITAR UMA RESERVA
// bookingRoute.put();

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
// bookingRoute.get();

export default bookingRoute;

/**
 * availableBooking: [
   "1 8:00",
   "2 8:00",
]
`${diaDaSemana} ${hora}`
Marcio Silva | 92 WDFT para Todos (11:54)
dd = req.body.date.getDate()
ss = req.body.date.getDay()
const string = `${ss} ${dd}`

 */
/**
 * /Pegar o mês (0-11) necessita de formatação:

getMonth()

//Pegar o dia do mês (1 ao 31)

getDate()

//Pegar o dia da semana (0 à 6) necessita de formatação:

getDay()

//Pegar a hora da reserva (0-23):

getHours()


---------------------------------------------------------
		Agendamento utilizando Date

ResourceModel:

avaliableBooking: array utilizando Date com os parâmetros do dia da semana (getDay) e horários disponíveis (getHours) Ex:

1
 * 
 */
