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
    const usersCollection = client.db("laptopBikroy").collection("allUsers");

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
    app.post("/allUsers", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/allUsers/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({
        isUser: user?.role === "User Account",
        isSeller: user?.role === "Seller Account",
        isAdmin: user?.role === "Admin",
      });
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Laptop Bikroy server is running");
});

app.listen(port, () => console.log(`Laptop Bikroy server running on ${port}`));
