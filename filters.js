'use strict';

class Filters {
    
  constructor(postalCode, kmFromPostalCode, minPrice, maxPrice, minSqft) {
    this.postalCode = 'v6b1s3';
    this.kmFromPostalCode = '3';
    this.minPrice = '1400';
    this.maxPrice = '5000';
    this.minSqft = '550';
  }
  
  getPostalCode() {
      return this.postalCode;
  }
  
  getKmFromPostalCode() {
      return this.kmFromPostalCode;
  }
  
  getMinPrice() {
      return this.minPrice;
  }
  
  getMaxPrice() {
      return this.maxPrice;
  }
  
  getMinSqft() {
      return this.minSqft;
  }

}

module.exports = Filters;