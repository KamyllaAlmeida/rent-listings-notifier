let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs'); 

var filter = { 
  postalCode:'v6b1s3',
  kmFromPostalCode:'3',
  minPrice: '1400',
  maxPrice: '1600',
  minSqft: '550'
}

var listOfRentals = [];

function getListOfRentals(totalLastSearch, listOfRentals){
  let url = `https://vancouver.craigslist.org/search/apa?availabilityMode=0&bundleDuplicates=1&hasPic=1&max_price=${filter.maxPrice}&minSqft=${filter.minSqft}&min_price=${filter.minPrice}&postal=${filter.postalCode}&s=${totalLastSearch}&search_distance=${filter.kmFromPostalCode}`;
  axios.get(url)
  .then(function (response) {
    if(response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      var totalRentals = $('.bottom').find('.totalcount').text();
      $('.result-row').each(function(i, elem) {
        listOfRentals.push({
            id: $(this).attr('data-pid'),
            title: $(this).find('.result-title').text(),
            price: $(this).find('a .result-price').text(),
            url: $(this).children('a').attr('href')
          })
          //console.log('* ', listOfRentals[i])      
      });
      if(listOfRentals.length >= parseInt(totalRentals, 10)) {
        console.log(listOfRentals.length)
        return listOfRentals;
      }
      return getHtmlCraigslist(listOfRentals.length, listOfRentals);
      
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

getListOfRentals('0', listOfRentals);



//module.exports = {test: listRentals};