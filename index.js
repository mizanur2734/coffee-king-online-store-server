const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const coffeeCollection = database.collection("coffees");

    // all coffee
    app.get("/coffees", async (req, res) => {
      const allCoffees = await coffeeCollection.find().toArray();
      res.send(allCoffees);
    });

    // save a coffee data in the database though post request
    app.post("/add-coffee", async (req, res) => {
      const coffeeData = req.body;
      console.log(coffeeData);
      const result = await coffeeCollection.insertOne(coffeeData);
      res.send(result);
    });

    // get a signgle coffe by id
    app.get("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const coffee = await coffeeCollection.findOne(filter);
      console.log(coffee);
      res.send(coffee);
    });

    // get a single coffee data by id
    app.get("/my-coffees/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const coffees = await coffeeCollection.find(filter).toArray();
      console.log(coffees);
      res.send(coffees);
    });

    // handle like toggle
    app.patch("/like/:coffeeId", async (req, res) => {
      const id = req.params.coffeeId;
      const email = req.body.email;
      const filter = { _id: new ObjectId(id) };
      const coffee = await coffeeCollection.findOne(filter);
      // if the email already exists in the likedBy array, remove it (dislike)
      const alreadyLiked = coffee?.likedBy.includes(email);

      console.log(
        "akdom surute like er obsta -----> alreadyLike:",
        alreadyLiked
      );

      const updateDoc = alreadyLiked
        ? {
            // dislike coffee (pop email from likedBy array)
            $pull: { likedBy: email },
          }
        : {
            // like coffee (pop email from likedBy array)
            $addToSet: { likedBy: email },
          };
      await coffeeCollection.updateOne(filter, updateDoc);

      console.log(
        "akdom sheshe like er obsta -----> alreadyLike:",
        !alreadyLiked
      );

      res.send({
        message: alreadyLiked ? "dislike successful" : "Like Successful",
        liked: !alreadyLiked,
      });
    });

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
