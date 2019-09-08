const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '1414660@hcmut.edu.vn',
    pass: '4wffhk2t'
  }
});