const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Movies } = require('../models/movie');
const { Rentals } = require('../models/rental');

router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('Bad request. Customer ID is not provided.');

  if (!req.body.movieId) return res.status(400).send('Bad request. Movie ID is not provided.');

  const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send('The rental is not found.');

  if (rental.dateReturned) return res.status(400).send('Bad request. The rental is already processed.');

  rental.return();
  await rental.save();

  await Movies.findByIdAndUpdate(rental.movie._id,
    { $inc: { numberInStock: 1 } }
  );

  return res.status(200).send(rental);
});

module.exports = router;