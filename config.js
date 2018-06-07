'use strict';
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/noteful',  
  TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost/noteful-test'
};

////'mongodb://dev:dev123@ds251240.mlab.com:51240/noteful-app'