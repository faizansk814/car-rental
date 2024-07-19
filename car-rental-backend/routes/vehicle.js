const express = require("express");
const { Vehicle , BookVehicle, Sequelize } = require("../models");
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

vehiclerouter.post('/book-vehicle', async (req, res) => {
    try {
      const { vehicleId, startDate, endDate } = req.body;
  
      // Check if the vehicle is already booked
      const existingBooking = await BookVehicle.findOne({
        where: {
          vehicleId,
          startDate: {
            [Sequelize.Op.lte]: endDate,
          },
          endDate: {
            [Sequelize.Op.gte]: startDate,
          },
        },
      });
  
      if (existingBooking) {
        return res.status(400).json({ message: 'Vehicle is already booked for the selected dates' });
      }
  
      // Create a new booking
      const booking = await BookVehicle.create({ vehicleId, startDate, endDate });
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = vehiclerouter;
