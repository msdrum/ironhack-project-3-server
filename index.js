import express from "express";
import * as dotenv from "dotenv";
import connect from "./config/db.config.js";
import userRoute from "./routes/user.routes.js";
import resourceRoute from "./routes/resource.routes.js";
import bookingRoute from "./routes/booking.routes.js";
import cors from "cors";

//habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//instanciar a variável que vai ficar responsável pelo nosso servidor -> app
const app = express();

app.use(cors({ origin: process.env.REACT_URL }));

//configurar o servidor para aceitar enviar e receber arquivos em JSON
app.use(express.json());

//conectando com o banco de dados
connect();

//rotas
app.use("/user", userRoute);
app.use("/resource", resourceRoute);
app.use("/booking", bookingRoute);

// o servidor subindo pro ar.
app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
