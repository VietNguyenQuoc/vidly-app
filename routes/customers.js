const express = require('express');
const router = express.Router();
const {Customers, validateNew, validateUpdate} = require('../models/customer');
const validateObjectId = require('../middleware/objectid');
const {Rentals} = require('../models/rental');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', async (req, res) => {
    const customers = await Customers.find();

    if (!customers) return res.status(404).send('Empty customer database.')

    res.send(customers);
})

router.post('/', async (req, res) => {
    const {error} = validateNew(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await new Customers({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold || false
    });

    await customer.save();
    res.send(customer);
});

router.put('/:id', validateObjectId, async (req, res) => {
  const {error} = validateUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customers.findById(req.params.id);

  if (!customer) return res.status(404).send('Customer not found');

  for (key in req.body) {
    customer[key] = req.body[key];
  }
  await customer.save();

  // Update all the rentals of this customer accordingly
  const rentals = await Rentals.find({ 'customer._id': customer._id });
  rentals.forEach(async rental => {
    await rental.updateCustomer(req.body);
  })
  
  console.log(rentals);
  res.send(rentals)
});

router.delete('/:id', auth, admin, validateObjectId, async (req, res) => {
  await Customers.findByIdAndDelete(req.params.id);

  res.send('Delete customer sucessfully.');
})

module.exports = router;