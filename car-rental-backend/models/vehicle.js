module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define('Vehicle', {
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    num_wheels: DataTypes.INTEGER,
    model: DataTypes.STRING,
  }, {});
  Vehicle.associate = function(models) {
    Vehicle.hasMany(models.BookVehicle, {
      foreignKey: 'vehicleId',
      as: 'bookings',
    });
  };
  return Vehicle;
};
