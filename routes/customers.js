const express = require('express');
const router = express.Router();
const {Customers, validate} = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customers.find();

    if (!customers) return res.status(404).send('Empty customer database.')

    res.send(customers);
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await new Customers({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold || false
    });

    await customer.save();
    res.send(customer);
});

module.exports = router;