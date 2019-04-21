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

function getListings(filter) {
  let mountedURL = mountURL(filter);
  let listOfRentals = getCraigslistListings (0, [], mountedURL); 
  return listOfRentals;
}

function getCraigslistListings(startIndex, listOfRentals, mountedURL) {
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
          price: $(this).children('a').find('.result-price').text(),
          url: $(this).children('a').attr('href')
        });
      });
      if(parseInt(rangeTo, 10) === parseInt(totalRentals, 10)) {
        return listOfRentals;
      }
      return getCraigslistListings(parseInt(rangeTo, 10), listOfRentals, mountedURL);
    } else {
      throw new Error("Error");
    }
  })
  .catch(function (error) {
    console.log(error);
    throw error;
  });
}

module.exports = {getListings};