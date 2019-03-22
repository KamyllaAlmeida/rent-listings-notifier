'use strict';

var AWS = require('aws-sdk');
var attr = require('dynamodb-data-types').AttributeValue;
var craigslistApartments = require('./craigslist-apartments');
var filters = require('./filters');

const Filter = new filters();
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});



module.exports.hello =   (event, context) => {

  var today = new Date();

  var apartmentsPromise = craigslistApartments.getListOfRentals('0',[]);
  return apartmentsPromise.then((result) => {
    return result;
  })
  .then((result) => {
    var data = {
      site: 'Craigslist',
      date: getFormattedDate(today),
      listings: result,
      updated: today.toString()
    }

    var dynamodbData = attr.wrap(data);
    
    var params = {
      TableName: 'rentals1table',
      Item: dynamodbData
    };
    
  return ddb.putItem(params).promise();
  }).then((data) => {
    return "Success";
  }).catch((err) => {
    console.log("dynamodb err: ", err, err.stack); // an error occurred
  })
.then((result) => {
  const testando = {
    statusCode: 200,
    body: JSON.stringify({ message: result })
  }
  return testando;
});
} 

function getFormattedDate(date) {
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  return yyyy + '-' + mm + '-' +dd;
}
  






