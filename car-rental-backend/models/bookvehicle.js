module.exports = (sequelize, DataTypes) => {
  const BookVehicle = sequelize.define('BookVehicle', {
    vehicleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {});
  BookVehicle.associate = function(models) {
    BookVehicle.belongsTo(models.Vehicle, {
      foreignKey: 'vehicleId',
      as: 'vehicle',
    });
  };
  return BookVehicle;
};
