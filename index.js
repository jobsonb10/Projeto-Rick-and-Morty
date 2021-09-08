require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");

const home = require("./componentes/home");
const readAll = require("./componentes/readAll");
const readById = require("./componentes/readById");
const create = require("./componentes/create");
const update = require("./componentes/update");
const del = require("./componentes/delete");

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(cors());
app.options("*", cors());

app.use("/home", home);
app.use("/personagens/readAll", readAll);
app.use("/personagens/readById", readById);
app.use("/personagens/create", create);
app.use("/personagens/update", update);
app.use("/personagens/delete", del);

app.all("*", function (req, res) {
  res.status(404).send({ message: "Endpoint was not found" });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || "Internal Server Error",
    },
  });
});

app.listen(port, () => {
  console.info(`Servidor rodando em http://localhost:${port}/home`);
});