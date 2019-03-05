'use strict';

//import search from './craigslist-apartments';
var { listOfRentals } =  require('./craigslist-apartments');


module.exports.hello = async (event, context) => {
  const response = await listOfRentals.getListOfRentals();

  const testando = {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }
  
  return testando;
  }; 
  






