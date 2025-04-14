const CrudRepository = require("./crud-repository");
const { Airport } = require("../models");

class AirportRepository extends CrudRepository {
  constructor() {
    super(Airport); // passing model to the CrudRepo
  }
}

module.exports = AirportRepository;
