const CrudRepository = require("./crud-repository");
const { Flight, Airplane, Airport, City } = require("../models");
const { Sequelize } = require("sequelize");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter, sort) {
    const flights = await Flight.findAll({
      where: filter,
      order: sort,
      include: [
        // Aliases needs to be declared in the model(Flight) also..
        {
          model: Airplane, // to get correspondin airplanes: joint or Eager loading =>Left join Flight.airplaneId = Airplane.id  (by default id is taken from referenced table)
          required: true, // changes outer to inner-join
          as: "airplane_detail", //  Flight.airplaneId = Airplane.id changes to Flight.airplaneId = airplane_detail.id
        },
        {
          model: Airport, // Left join Flight.departureAirportId = Airport.id  => default behaviour
          required: true,
          as: "departure_airport",
          on: {
            // this will change Airport.id to Airport.code or departure_airport.code
            col1: Sequelize.where(
              Sequelize.col("Flight.departureAirportId"),
              "=",
              Sequelize.col("departure_airport.code")
            ),
          },
          include: {
            model: City,
            required: true, // inner-join departure_airport.cityId = City.id
          },
        },
        {
          model: Airport, // Left join Flight.arrivalAirportId = Airport.id  => default behaviour
          required: true,
          as: "arrival_airport",
          on: {
            // this will change Airport.id to Airport.code or arrival_airport.code
            col1: Sequelize.where(
              Sequelize.col("Flight.arrivalAirportId"),
              "=",
              Sequelize.col("arrival_airport.code")
            ),
          },
          include: {
            model: City,
            required: true, // Inner-join departure_airport.cityId = City.id
          },
        },
      ],
    });
    return flights;
  }
}

module.exports = FlightRepository;
