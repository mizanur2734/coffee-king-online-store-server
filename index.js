const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("coffee-king");
    const coffeeCollection = database.collection('coffees')

    // save a coffee data in the database though post request
    app.post("/add-coffee", async (req, res) =>{
        const coffeeData = req.body;
        console.log(coffeeData)
        const result = await coffeeCollection.insertOne(coffeeData)
        res.send(result)
        // res.status(201).send({message: "data recevide, thank you",})
    })


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
