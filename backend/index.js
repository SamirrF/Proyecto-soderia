const express = require('express');
const morgan = require ('morgan');
const Database = require ('./db');
const ClientesRoute = require("./routes/ClientesRoute");
const PedidosRoute = require("./routes/PedidosRoute");
const ProductosRoute = require("./routes/ProductosRoute");
const LoginRoute = require("./routes/LoginRoute");
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require("express-session");

const corsOption= {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true
}


Database.obtenerConexion()
//configuracion inicial
const app = express();
//midleware
app.use(cors(corsOption));
app.use(express.json());
app.use(morgan('dev'));
app.use("/pedidos",PedidosRoute);
app.use("/clientes",ClientesRoute);
app.use("/productos",ProductosRoute);
app.use("/login", LoginRoute);
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi backend con Node.js!');
});
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
  





