const crypto = require('crypto');

module.exports = function generatePass() {
    return crypto.randomBytes(4).toString('HEX');
}