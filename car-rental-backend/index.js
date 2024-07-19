const express = require("express");
const db = require("./models/index");
const vehiclerouter = require("./routes/vehicle");
const cors= require('cors')
const app = express();
app.use(cors())
app.use(express.json());

app.use("/vehicle",vehiclerouter)

app.get("/", (req, res) => {
  return res.json({ msg: "server running" });
});



db.sequelize.sync().then(() => {
  app.listen(4031, () => {
    console.log("connected");
  });
});
