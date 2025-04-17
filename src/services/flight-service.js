const { StatusCodes } = require("http-status-codes");
const { FlightRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { Op } = require("sequelize");

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
    // for other types of error:
    throw new AppError(
      "Can't create a new Flight object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

// /api/v1/flights?trips=MUL-DEL+price=1000-5000+travellers=2 ...
async function getAllFlights(query) {
  try {
    let customFilter = {};
    // trips=MUM-DEL format
    if (query.trips) {
      // query is a object with fields like trips,price,travellers etc..
      const [departureAirportId, arrivalAirportId] = query.trips.split("-");
      customFilter.departureAirportId = departureAirportId;
      customFilter.arrivalAirportId = arrivalAirportId;
      //TODO: check that departur and arrival airport are not same
      if (departureAirportId == arrivalAirportId) {
        throw new AppError(
          "Departure and Arrival airport Id can not be same",
          StatusCodes.BAD_REQUEST
        );
      }
    }
    // price=1000-20000
    if (query.price) {
      const [minPrice, maxPrice] = query.price.split("-");
      // if user does not send min or max price or he sends only one price then add a default value
      customFilter.price = {
        [Op.between]: [
          minPrice == undefined ? 0 : minPrice,
          maxPrice == undefined ? 30000 : maxPrice,
        ],
      };
    }
    // travellers=2
    if (query.travellers) {
      // no of total remaining seats(totalSeats) >= seats searched by the user
      customFilter.totalSeats = {
        [Op.gte]: query.travellers,
      };
    }
    const flights = await flightRepository.getAllFlights(customFilter);
    return flights;
  } catch (error) {
    if (error instanceof AppError) {
      throw new AppError(error.explanation, error.statusCode);
    }
    throw new AppError(
      `Can't retrieve flights data!`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createFlight,
  getAllFlights,
};
