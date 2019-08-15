const mongoose = require('mongoose');

const result = mongoose.Types.ObjectId.isValid('abrrr12345678');

console.log(result);