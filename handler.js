'use strict';

var craigslistApartments = require('./craigslist-apartments');
var filters = require('./filters');

module.exports.hello = (event, context) => {
  const filter = new filters(event.filters.postalCode, event.filters.kmFromPostalCode, event.filters.minPrice, event.filters.maxPrice, event.filters.minSqft);
  console.log("Filtro: ", filter)
  var apartmentsPromise = craigslistApartments.getListOfRentals(filter);
  return apartmentsPromise.then((result) => {
    console.log("Resultadoooooooooooooooooooooooooooo")
    return result;
  })
  .then((result) => {
    const testando = {
      statusCode: 200,
      body: JSON.stringify({ message: result })
    }
    return testando;
  })
};