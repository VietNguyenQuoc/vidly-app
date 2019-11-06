console.log(__dirname.split('/'));
const config = require('config');

module.exports = function () {
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: Secure key is not defined on the mother system.');
  }
}