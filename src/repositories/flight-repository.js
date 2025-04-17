const CrudRepository = require("./crud-repository");
const { Flight } = require("../models");

class FlightRepository extends CrudRepository {
  constructor() {
    super(Flight);
  }

  async getAllFlights(filter) {
    const flights = await Flight.findAll({
      where: filter, // where accepts json objects
    });
    return flights;
  }
}

module.exports = FlightRepository;
