const express = require('express');
const router = express.Router();
const {Customers, validate} = require('../models/customer');

router.get('/', async (req, res) => {
    const customers = await Customers.find();

    if (!customers) return res.status(404).send('Empty customer database.')

    res.send(customers);
})

router.post('/', async (req, res) => {
    const result = validate(req.body).error;
    if (result) res.status(400).send('Invalid customer input.', result);

    const customer = await new Customers({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold || false
    });

    res.send(await customer.save());
})

module.exports = router;