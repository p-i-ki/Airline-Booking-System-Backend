"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airport extends Model {
    static associate(models) {
      // one city has many airports and each airport belongs to one city onle, an airport can't belongs to more than one city : ONE to MANY
      this.belongsTo(models.City, {
        foreignKey: "cityId",
        onDelete: "CASCADE",
      });
      this.hasMany(models.Flight, {
        foreignKey: "arrivalAirportId",
      });
      this.hasMany(models.Flight, {
        foreignKey: "departureAirportId",
      });
    }
  }
  Airport.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      address: {
        type: DataTypes.STRING,
        unique: true,
      },
      cityId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Airport",
    }
  );
  return Airport;
};
