const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized Access");
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decided) {
    if (err) {
      return res.status(403).send({ message: `forbidden access` });
    }
    req.decided = decided;
    next();
  });
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASWORD}@cluster0.jc72o0s.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
    const reportedProductsCollection = client
      .db("laptopBikroy")
      .collection("reportedProducts");
    const bookingCollection = client.db("laptopBikroy").collection("bookings");
    const productsCollection = client
      .db("laptopBikroy")
      .collection("allProducts");
    const advertiseCollection = client
      .db("laptopBikroy")
      .collection("allAdvertisedProducts");

    app.get("/laptops", async (req, res) => {
      const query = {};
      const cursor = await laptopCollections.find(query).toArray();
      res.send(cursor);
    });
    app.post("/laptops", async (req, res) => {
      const product = req.body;
      const result = await laptopCollections.insertOne(product);
      res.send(result);
    });
    app.get("/laptops/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { product_category: brand };
      const result = await laptopCollections.find(query).toArray();
      res.send(result);
    });
    app.delete("/laptops/:productName", async (req, res) => {
      const productName = req.params.productName;
      const filter = { product_name: productName };
      const result = await laptopCollections.deleteOne(filter);
      res.send(result);
    });
    app.put("/laptops/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "booked",
        },
      };
      const result = await laptopCollections.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.post("/allUsers", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    app.get("/allUsers/seller", async (req, res) => {
      const query = { role: "Seller Account" };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/allUsers/user", async (req, res) => {
      const query = { role: "User Account" };
      const result = await usersCollection.find(query).toArray();
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
    app.delete("/allUsers/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(filter);
      res.send(result);
    });
    app.post("/allProducts", async (req, res) => {
      const product = req.body;
      const result = productsCollection.insertOne(product);
      res.send(result);
    });
    app.get("/allProducts", async (req, res) => {
      const query = {};
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/allProducts/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { seller_email: email };
      const sort = { _id: -1 };
      const result = await productsCollection.find(query).sort(sort).toArray();
      res.send(result);
    });
    app.delete("/allProducts/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const filter = { seller_email: email, _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(filter);
      res.send(result);
    });
    app.delete("/allProducts/:productName", async (req, res) => {
      const productName = req.params.productName;
      const filter = { product_name: productName };
      const result = await productsCollection.deleteOne(filter);
      res.send(result);
    });
    app.put("/allProducts/:email/:id", async (req, res) => {
      const email = req.params.email;
      const id = req.params.id;
      const filter = { seller_email: email, _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          status: "advertised",
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.post("/allAdvertisedProducts", async (req, res) => {
      const user = req.body;
      const result = await advertiseCollection.insertOne(user);
      res.send(result);
    });
    app.get("/allAdvertisedProducts", async (req, res) => {
      const query = {};
      const sort = { _id: -1 };
      const result = await advertiseCollection.find(query).sort(sort).toArray();
      res.send(result);
    });
    app.delete("/allAdvertisedProducts/:productName", async (req, res) => {
      const productName = req.params.productName;
      const filter = { product_name: productName };
      const result = await advertiseCollection.deleteOne(filter);
      res.send(result);
    });
    app.post("/booking", async (req, res) => {
      const user = req.body;
      const result = await bookingCollection.insertOne(user);
      res.send(result);
    });
    app.get(`/booking/:email`, async (req, res) => {
      const email = req.params.email;
      const query = { buyer_email: email };
      const sort = { _id: -1 };
      const result = await bookingCollection.find(query).sort(sort).toArray();
      res.send(result);
    });
    app.post("/reportedProducts", async (req, res) => {
      const product = req.body;
      const result = await reportedProductsCollection.insertOne(product);
      res.send(result);
    });
    app.get("/reportedProducts", async (req, res) => {
      const query = {};
      const result = await reportedProductsCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/reportedProducts/:productName", async (req, res) => {
      const productName = req.params.productName;
      const filter = { product_name: productName };
      const result = await reportedProductsCollection.deleteOne(filter);
      res.send(result);
    });
    app.get("jwt", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      if (user) {
        const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
          expiresIn: "1h",
        });
        return res.send({ accessToken: token });
      }
      res.status(403).send({ accessToken: "ggwp" });
    });
  } finally {
  }
}
run().catch(console.log);

app.get("/", async (req, res) => {
  res.send("Laptop Bikroy server is running");
});

app.listen(port, () => console.log(`Laptop Bikroy server running on ${port}`));
