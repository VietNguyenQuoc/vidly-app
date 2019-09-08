const path = require('path');
const fs = require('fs');
const express = require("express");
const router = express.Router();
const request = require('request').defaults({ encoding: null });

router.get('/', (req, res) => {
  const url = req.query.url;
  const height = req.query.height;
  const width = req.query.width;

  request.get(url, (err, response, body) => {
    console.log(body);
    res.type('image/jpg');
    res.send(body);
  })

  // res.send(img);
})

module.exports = router;
