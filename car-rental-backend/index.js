const express = require("express");
const db = require("./models/index");
const { Vehicle } = require("./models");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ msg: "server running" });
});

// API to create a new vehicle
app.post("/vehicles", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

db.sequelize.sync().then(() => {
  app.listen(4031, () => {
    console.log("connected");
  });
});
