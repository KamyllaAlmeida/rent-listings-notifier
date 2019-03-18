'use strict';

var craigslistApartments = require('./craigslist-apartments');
var filters = require('./filters');
const Filter = new filters();

module.exports.hello =   (event, context) => {
  var apartmentsPromise = craigslistApartments.getListOfRentals('0',[]);
  return apartmentsPromise.then((result) => {
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
  






