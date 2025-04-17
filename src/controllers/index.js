module.exports = {
  AirplaneController: require("./airplane-controller"),
  CityController: require("./city-controller"),
  AirportController: require("./airport-controller"),
  FlightController: require("./flight-controller"),
};

// this is similar to
// AirplaneController: { createAirplane }  => means now  AirplaneController is an object with method createAirplane
// access it like -> AirplaneController.createAirplane
