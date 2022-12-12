import express from "express";
import BookingModel from "../model/booking.model.js";
import ResourceModel from "../model/resource.model.js";

const bookingRoute = express.Router();

//ROUTES

//ROTA TESTE para agendamento
bookingRoute.post("/booking/", async (req, res) => {
  try {
    const newBooking = await BookingModel.create({
      ...req.body,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

bookingRoute.post("/availability", async (req, res) => {
  try {
    //passaria a data a ser consultada, vinda do front (12/12/2022)
    // const { schedule } = req.body;
    // console.log(schedule, typeof schedule);
    // const date = new Date(schedule);
    const date = new Date(req.body.schedule);
    console.log(date);

    //descobrir qual dia da semana (12/12/2022) --> 1
    const diaSemana = date.getDay();
    console.log(diaSemana, typeof diaSemana);
    const regex = new RegExp(`^${diaSemana}`)
    console.log(regex, typeof regex);

    //consultar o availableBooking do Resource se existe nesse dia da semana
    const hoursAvailable = await ResourceModel.
      find(
        {
          availableBooking: {
              $in: [regex]
           }
          }
          ,
          {
           name: 1,
           availableBooking: 1
          }
      );  
    
    //fazer forEach em hoursAvailable
    const newArray = hoursAvailable.map( (resource) => {

      const hours = resource.availableBooking.filter( (hour) => {
        
        //para cada hora, buscar na collection Booking se há reserva

        
        return +hour[0] === diaSemana
      })
      console.log(hours);

      return {_id: resource._id, 
              name: resource.name,
              availableBooking: hours}
    })


    return res.status(200).json(newArray);

    //caso exista, consultar collection Bookings filtrando pela data (12/12/2022), pelo status !reservado e pelo horário (12/12/2022 1 09:00)

    //se horário estiver disponível, mostrar

    //se horário estiver indisponível, não mostrar


  } catch (error) {
    console.log(error);
    return res.status(500).json(error.errors);
  }
});

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