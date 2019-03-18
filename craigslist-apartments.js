'use strict';

let axios = require('axios');
let cheerio = require('cheerio');
let filters = require('./filters');

const Filter = new filters();
let mountedURL = mountURL(Filter); 

function mountURL(filter) {
 let url = `https://vancouver.craigslist.org/search/apa?availabilityMode=0&bundleDuplicates=1&hasPic=1`;
 if(filter.getMaxPrice()) {
   url = url + `&max_price=${filter.getMaxPrice()}`;
 }
 if(filter.getMinPrice()) {
   url = url + `&min_price=${filter.getMinPrice()}`; 
 }
 if(filter.getKmFromPostalCode()) {
   url = url + `&search_distance=${filter.getKmFromPostalCode()}`; 
 }
 if(filter.getPostalCode()) {
   url = url + `&postal=${filter.getPostalCode()}`; 
 }
 if(filter.getMinSqft()) {
   url = url + `&minSqft=${filter.getMinSqft()}`; 
 }
 return url;
}

function getListOfRentals(totalLastSearch, listOfRentals) {
  let url = mountedURL + `&s=${totalLastSearch}`;
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
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

module.exports = {getListOfRentals};