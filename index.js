const express = require("express");
const mongodb = require("mongodb");
require("dotenv").config();

const ObjectId = mongodb.ObjectId;

(async () => {
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;

  const app = express();
  app.use(express.json());
  const port = process.env.PORT || 3000;
  const connectionString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.u51db.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  const options = {
    useUnifiedTopology: true,
  };

  const client = await mongodb.MongoClient.connect(connectionString, options);

  const db = client.db(dbName);
  const personagens = db.collection("personagens");

  const getPersonagensValidas = () => personagens.find({}).toArray();

  const getPersonagemById = async (id) =>
    personagens.findOne({ _id: ObjectId(id) });

  app.all("/*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Methods", "*");

    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization"
    );

    next();
  });

  app.get("/", (req, res) => {
    res.send({ info: "Hello world!" });
  });

  app.get("/personagens", async (req, res) => {
    res.send(await getPersonagensValidas());
  });

  app.get("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const personagem = await getPersonagemById(id);
    res.send(personagem);
  });

  app.post("/personagens", async (req, res) => {
    const objeto = req.body;

    if (!objeto || !objeto.nome || !objeto.imagemUrl) {
      res.send("Objeto inválido!");
      return;
    }

    const insertCount = await personagens.insertOne(objeto);

    if (!insertCount) {
      res.send("Ocorreu um erro");
      return;
    }

    res.send(objeto);
  });



  app.put("/personagens/:id", async (req, res) => {
    const id = req.params.id;
    const objeto = req.body;
    res.send(
      await personagens.updateOne(
        {
          _id: ObjectId(id),
        },
        {
          $set: objeto,
        }
      )
    );
  });


  
  app.delete("/personagens/:id", async (req, res) => {
    const id = req.params.id;

    await personagens.deleteOne({
      _id: ObjectId(id),
    });

    res.send({ message: "Personagem deletado com sucesso!" });
  });

  app.listen(port, () => {
    console.info(`App rodando em http://localhost: ${port}`);
  });
})();
