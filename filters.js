'use strict';

class Filters {
    
  constructor(postalCode, kmFromPostalCode, minPrice, maxPrice, minSqft) {
    this.postalCode = postalCode;
    this.kmFromPostalCode = kmFromPostalCode;
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.minSqft = minSqft;
    
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

Filters.prototype.greet = function() {
  return `${this.name} says hello.`;
}

module.exports = Filters;