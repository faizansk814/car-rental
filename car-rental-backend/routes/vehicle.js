const express = require("express");
const { Vehicle } = require("../models");
const vehiclerouter = express.Router();

// API to create a new vehicle
vehiclerouter.post("/post", async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

vehiclerouter.get("/get", async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

vehiclerouter.post("/vehicle-types", async (req, res) => {
  try {
    const { num_wheels } = req.body;
    const vehicles = await Vehicle.findAll({
      where: { num_wheels },
      attributes: ["type"],
      group: ["type"],
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = vehiclerouter;
