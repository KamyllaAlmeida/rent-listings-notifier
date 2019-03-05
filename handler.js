'use strict';

//import search from './craigslist-apartments';
//var { test } =  require('./craigslist-apartments');
var { search, detail } =  require('craigslist-searcher');


module.exports.hello = async (event, context) => {
  const response = await test();

  const testando = {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }
  
  return testando;
  }; 
  

  

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function test () {
  console.log("Tá chamando");
  search({
    city: 'seattle', //City's name. Optional. If no city is given, the function will search worldwidely.
    query: 'computer', //Keword for the query. Using a white space to separate multiple key words. (e.g. 'computer book')  Optional.
    category: 'sss', //Category's keyword (Please see below). Optional.
    offset: 0 //The number of skipping itmes. Optional.
    })
    .then(resultArray => {
      console.log(resultArray);
      return "OK";
      //resultArray will be an array that contains result data.
      /*It will be like [{
                          datetime: '',
                          url: '',
                          dataId: '',
                          title: '',
                          price: '',
                          region: ''
                        },
                        ...]
      */
  });
}





