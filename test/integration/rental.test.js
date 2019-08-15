const {Rentals} = require('../../models/rental');
const {Users} = require('../../models/user');
const {Movies} = require('../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
let server;
const moment = require('moment');
const _ = require('lodash');

describe('POST /api/returns', () => {
  let rental;
  let customerId;
  let movieId;
  let token;

  beforeEach(async () => { 
    server = require('../../index');

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new Users().generateAuthToken();

    rental = new Rentals({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });

    await rental.save();
  });

  afterEach(async () => { 
    await Rentals.deleteMany({});
    await Movies.deleteMany({});
    await server.close(); 
  });

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };
  // 1 step: POST a new rental
  // 2 step: POST a return

  it('should return a 401 if customer doesnt log in', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return a 400 if customerId is not provided', async () => {
    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return a 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return a 404 if rental is not found', async () => {
    await Rentals.deleteMany({});

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return a 400 if rental is already processed.', async () => {
    rental.dateReturned = Date.now(); 
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return a 200 if it is a valid request.', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the return Date if it is a valid request.', async () => {
    const res = await exec();

    const rentalInDB = await Rentals.findById(rental._id);

    expect(rentalInDB.dateReturned).toBeDefined();
  });

  it('should calculate the rental fee if it is a valid request', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();
    
    const res = await exec();

    const rentalInDB = await Rentals.findById(rental._id);

    expect(rentalInDB.rentalFee).toBe(14);
  });

  it('should increase the stock movie', async () => {
    // Populate the movie db
    await new Movies({
      _id: movieId,
      title: '12345',
      genre: {
        name: '12345'
      },
      numberInStock: 0
    }).save();

    await exec();

    const movieInDB = await Movies.findById(movieId);

    expect(movieInDB.numberInStock).toBe(1);
  });

  it('should return the rental if the input is valid.', async () => {
    const res = await exec();

    expect(res.body).toMatchObject(_.pick(rental, ['customer.name', 'movie.title']));
    
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(['customer', 'movie', 'dateOut', 'dateReturned', 'rentalFee']));
  })
});