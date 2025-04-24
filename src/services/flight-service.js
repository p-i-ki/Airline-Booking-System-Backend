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

// /api/v1/flights?trips=MUL-DEL&price=1000-5000&travellers=2&tripDate=2025-04-22&sort=departureTime_ASC,price_DESC ...
// Refer to Flipkart flights search:
async function getAllFlights(query) {
  try {
    let customFilter = {};
    const endingTripTime = " 23:59:00";
    let sortFilters = [];

    // trips=MUM-DEL format
    if (query.trips) {
      // query is an object with fields like trips,price,travellers etc..
      const [departureAirportId, arrivalAirportId] = query.trips.split("-");
      customFilter.departureAirportId = departureAirportId;
      customFilter.arrivalAirportId = arrivalAirportId;
      // check that departur and arrival airports are not same
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
    // 2025-04-22
    if (query.tripDate) {
      customFilter.departureTime = {
        // by default tripDate will have starting time 00:00:00 : so it will query all the flights on a particular data from 00:00:00 to 23:59:00
        [Op.between]: [query.tripDate, query.tripDate + endingTripTime],
      };
    }
    // sort = departureTime_ASC,price_DESC
    // if both derpartureTime and price are passed then price will apply on sorting if two flights have same departureTime, so send only price if u want to sort on the basis of flights prices.
    if (query.sort) {
      const params = query.sort.split(","); // [ 'departureTime_ASC', 'price_DESC' ]
      const sortFilter = params.map((param) => param.split("_")); // [['departureTime', 'ASC'],['price', 'DESC']]
      sortFilters = sortFilter;
    }
    const flights = await flightRepository.getAllFlights(
      customFilter,
      sortFilters
    );
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

// customFilter:
// {
// departureAirportId : departureAirportId;
// arrivalAirportId : arrivalAirportId;
// price: {
//   [Op.between]: [
//     minPrice == undefined ? 0 : minPrice,
//     maxPrice == undefined ? 30000 : maxPrice,
//   ],
// },
// totalSeats: {
//   [Op.gte]: query.travellers,
// },
// departureTime: {
//   [Op.between]: [query.tripDate, query.tripDate + endingTripTime],
// },
// }

// Sorting:
// Departure Time in Ascending Order (ASC) – This means flights will be listed starting from the earliest departure time to the latest.
// Price in Descending Order (DESC) – Within the same departure time, flights will be sorted from the most expensive to the cheapest.
// So the primary sorting factor is departure time (earliest flights first), and within flights that have the same departure time, the more expensive ones appear first.
// If you write order: [ [ 'price', 'DESC' ], [ 'departureTime', 'ASC' ] ], the sorting priority will change:
// Price in Descending Order (DESC) – Flights will be listed starting from the most expensive to the cheapest.
// Departure Time in Ascending Order (ASC) – Within the same price range, flights with earlier departure times will appear first.
// Also you can pass only sort=price_DESC to sort only on the basis of price.
