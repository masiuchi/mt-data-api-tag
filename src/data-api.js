const DataAPI = require('./mt-data-api.min.js')

module.exports = new DataAPI({
  // baseUrl: 'https://app.movabletype.jp/mt/mt-data-api.cgi',
  baseUrl: 'http://localhost:5000/mt-data-api.cgi',
  clientId: 'riot'
});
