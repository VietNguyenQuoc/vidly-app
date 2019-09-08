const request = require('supertest');
let server;
const { Customers } = require('../../models/customer');

describe('POST /api/customers', () => {
  let customer = {
    name: '',
    phone: '',
    isGold: false
  }

  beforeEach(async () => {
    server = require('../../index');
    await Customers.deleteMany({});
  })

  afterEach(async () => {
    await server.close();
  })

  exec = () => {
    return request(server).post('/api/customers').send(customer);
  }

  it('should return 400 if customer name is not inputed', async () => {
    customer.phone = '12345';

    const res = await request(server).post('/api/customers').send(customer);

    expect(res.status).toBe(400);
  });

  it('should return 400 if customer name is less than 5 characters', async () => {
    customer.name = 'aaaa'
    customer.phone = '12345';

    const res = await request(server).post('/api/customers').send(customer);

    expect(res.status).toBe(400);
  });

  it('should return 400 if customer name is more than 50 characters', async () => {
    customer.name = new Array(52).join('a');
    customer.phone = '12345';

    const res = await request(server).post('/api/customers').send(customer);

    expect(res.status).toBe(400);
  });

  it('should return 400 if phone name is not inputed', async () => {
    customer.name = 'aaaaa'

    const res = await request(server).post('/api/customers').send(customer);

    expect(res.status).toBe(400);
  });

  it('should return 400 if phone name is less than 5', async () => {
    customer.name = 'aaaaa'
    customer.phone = '1'

    const res = await request(server).post('/api/customers').send(customer);

    expect(res.status).toBe(400);
  });
})