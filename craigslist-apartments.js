'use strict';

let axios = require('axios');
let cheerio = require('cheerio');

function mountURL(filter) {
 let url = `https://vancouver.craigslist.org/search/apa?availabilityMode=0&bundleDuplicates=1&hasPic=1`;
 if(filter.maxPrice) {
   url = url + `&max_price=${filter.maxPrice}`;
 }
 if(filter.minPrice) {
   url = url + `&min_price=${filter.minPrice}`; 
 }
 if(filter.kmFromPostalCode) {
   url = url + `&search_distance=${filter.kmFromPostalCode}`; 
 }
 if(filter.postalCode) {
   url = url + `&postal=${filter.postalCode}`; 
 }
 if(filter.minSqft) {
   url = url + `&minSqft=${filter.minSqft}`; 
 }
 return url;
}

function getListOfRentals(filter) {
  let mountedURL = mountURL(filter);
  let listOfRentals = getListOfRentalsFromCraigslist (0, [], mountedURL); 
  return listOfRentals;
}

function getListOfRentalsFromCraigslist(startIndex, listOfRentals, mountedURL) {
  let url = mountedURL + `&s=${startIndex}`;
  return axios.get(url)
  .then(function (response) {
    if(response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      var totalRentals = $('.bottom').find('.totalcount').text();
      var rangeTo = $('.bottom').find('.rangeTo').text();
      $('.rows').children('li').each(function(i, elem) {
        listOfRentals.push({
          id: $(this).attr('data-pid'),
          title: $(this).find('.result-title').text(),
          price: $(this).find('a .result-price').text(),
          url: $(this).children('a').attr('href')
        });
      });
      if(parseInt(rangeTo, 10) === parseInt(totalRentals, 10)) {
        return listOfRentals;
      }
      return getListOfRentals(parseInt(rangeTo, 10), listOfRentals);
    } else {
      console.log('The function getListOfRentalsFromCraigslist returned an unexpected value. Status: ',response.status);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

module.exports = {getListOfRentals};