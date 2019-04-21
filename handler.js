'use strict';

var AWS = require('aws-sdk');
var attr = require('dynamodb-data-types').AttributeValue;
var craigslistApartments = require('./craigslist-apartments');
var filters = require('./filters');

var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

module.exports.hello = (event, context) => {
  const filter = new filters(event.filters.postalCode, event.filters.kmFromPostalCode, event.filters.minPrice, event.filters.maxPrice, event.filters.minSqft);
  var apartmentsPromise = craigslistApartments.getListings(filter);
  return apartmentsPromise.then((result) => {
    return result;
  })
  .then((apartmentListings) => {
    return storeInDB(ddb, apartmentListings);
  })
  .then((todaysListings) => {
    var yesterdayListingsPromise = getYesterdaysListings(ddb);
    return yesterdayListingsPromise.then((result) => {
      return result;
    })
    .then((yesterdayListings) => {
      var apartmentListings = {
        todaysListings: todaysListings,
        yesterdayListings: yesterdayListings
      }
      return apartmentListings;
    }) 
  })
  .then((apartmentListings) => {
    var apartments = getSeparetedListings(apartmentListings);
    var message = createdMessage(apartments);
    return sendEmail(message);
  })
}

function getSeparetedListings(apartmentListings) {
  var apartments = {
    new: [],
    all: apartmentListings.todaysListings,
    removed: []
  };
  apartmentListings.todaysListings.forEach(function(element) {
    var elementPos = apartmentListings.yesterdayListings.listings.map(function(x) {return x.id; }).indexOf(element.id); 
    if(elementPos === -1) {
      apartments.new.push(element);
    }
  });
  apartmentListings.yesterdayListings.listings.forEach(function(element) {
    var elementPos = apartmentListings.todaysListings.map(function(x) {return x.id; }).indexOf(element.id); 
    if(elementPos === -1) {
      apartments.removed.push(element);
    } 
  });
  return apartments;
}

function storeInDB(ddb, apartmentListings) {
  var today = new Date();
  var data = {
    site: 'Craigslist',
    date: getFormattedDate(today),
    listings: apartmentListings,
    updated: today.toString()
  }

  var dynamodbData = attr.wrap(data);
  
  var params = {
    TableName: process.env.tableName,
    Item: dynamodbData
  };
  
  return ddb.putItem(params).promise()
  .then((result) => {
    console.log("Listings saved in DDB");
    return apartmentListings;
  })
  .catch((err) => {
    console.log("dynamodb err: ", err, err.stack); // an error occurred
    throw err;
  });
}

function calculateYesterdayDate() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  return getFormattedDate(date);
}

function getYesterdaysListings(ddb) {
  var yesterday = calculateYesterdayDate();
  var params = {
    TableName: process.env.tableName,
    Key: {
      'site': {S: 'Craigslist'},
      'date': {S: yesterday}
    }
  };

  return ddb.getItem(params).promise()
  .then((result) => {
    return attr.unwrap(result.Item);
  })
  .catch((err) => {
    console.log("dynamodb err: ", err, err.stack); // an error occurred
    throw err
  });
}

function getFormattedDate(date) {
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = date.getFullYear();
  return yyyy + '-' + mm + '-' +dd;
}

function sendEmail(message) {
  var params = {
    Message: message,
    TopicArn: process.env.topic
  };
  
  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  return publishTextPromise.then(
    function(data) {
      console.log("Message ${params.Message} send sent to the topic ${params.TopicArn}");
      console.log("MessageID is " + data.MessageId);
      return data.MessageId;
    }).catch(
      function(err) {
        console.log("Entrou email promise");
      console.error(err, err.stack);
    });
}

function createdMessage(apartments) {
  var message = `Hello,\n\nLook at the list of apartments on Craigslist we have selected for you today. \n\n`;

  if(apartments.new.length) {
    var newItems = `${apartments.new.length} new offers were found according to your filters. \n###  Offers added today:  ###\n`;
    apartments.new.forEach(function(element) {
      newItems += `  *  ${element.title} - Price: ${element.price}\n   ${element.url}\n`;
    });
    message += newItems + '\n';
  } else {
    message += `Sorry, we did not find any new apartment for today. \n` + '\n';
  }

  if(apartments.removed.length) {
    var removedItems =  '###  Offers removed:  ###\n';
    apartments.removed.forEach(function(element) {
      removedItems += `  *  ${element.title} - Price: ${element.price}\n`;
    });
    message += removedItems + '\n';
  } 

  if(apartments.all.length) {
    var avaiableItems = '###  All offers avaiable:  ###\n';
    apartments.all.forEach(function(element) {
      avaiableItems += `  *  ${element.title} - Price: ${element.price}\n   ${element.url}\n`;
    });
    message += avaiableItems + '\n';
  }
  return message;
}