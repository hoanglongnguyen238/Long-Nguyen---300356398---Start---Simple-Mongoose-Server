const mongoose = require("mongoose");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// require('dotenv').config();

const port = process.env.PORT || 3000;

// Create a Schema object
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  myName: { type: String, required: true },
  mySID: { type: String, required: true },
});

// Create a Model object
const Student = mongoose.model("S24students", studentSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

app.post("/", async (req, res) => {
  // get the data from the form
  const myuri = req.body.myuri;
  if (myuri == null || myuri === "") {
    res.status(404).json({ message: "Please provide a valid Atlas URI" });
  } else {
    // connect to the database and log the connection
    mongoose
      .connect(myuri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB: ", error);
      });

    // add the data to the database
    const newStudent = new Student({
      myName: "Hoang Long Nguyen",
      mySID: "300356398",
    });

    newStudent
      .save()
      .then((savedUser) => {
        res.send(`<h1>Document Added</h1>
          <h2>Name: ${savedUser.myName}
          <h2>Student ID: ${savedUser.mySID}
        `);
      })
      .catch((error) => {
        res.status(404).json({ message: error.message });
      });

    // send a response to the user
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
