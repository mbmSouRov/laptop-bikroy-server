const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASWORD}@cluster0.jc72o0s.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
//ggwp

async function run() {
  try {
    const laptopCollections = client
      .db("laptopBikroy")
      .collection("laptopCollections");

    app.get("/laptops", async (req, res) => {
      const query = {};
      const cursor = await laptopCollections.find(query).toArray();
      res.send(cursor);
    });
    app.get("/laptops/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const result = await laptopCollections.find(query).toArray();
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Laptop Bikroy server is running");
});

app.listen(port, () => console.log(`Laptop Bikroy server running on ${port}`));
