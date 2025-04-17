"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flight extends Model {
    static associate(models) {
      // Every flight is an airplane, so it has a airplaneId
      this.belongsTo(models.Airplane, {
        foreignKey: "airplaneId",
      });
      // Every flight will be arrived at some airport:
      this.belongsTo(models.Airport, {
        foreignKey: "arrivalAirportId",
      });
      // Every flight will be departued from some airport:
      this.belongsTo(models.Airport, {
        foreignKey: "departureAirportId",
      });
    }
  }
  Flight.init(
    {
      flightNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airplaneId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      departureAirportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalAirportId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      departureTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      boardingGate: {
        type: DataTypes.STRING,
      },
      totalSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Flight",
    }
  );
  return Flight;
};
