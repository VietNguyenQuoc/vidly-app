const express = require('express');
const app = express();
require('express-async-errors');

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

const PORT = process.env.NODE_PORT || 3000;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}....`));
// addNewGenre();

module.exports = server;


