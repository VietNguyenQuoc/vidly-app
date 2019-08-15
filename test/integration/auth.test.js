const request = require('supertest');
let server;
const {Users} = require('../../models/user');

describe('/middleware/auth', () => {
  beforeEach(() => { 
    server = require('../../index');
    token = new Users().generateAuthToken();
  });
  afterEach(async () => { await server.close(); });

  let token;
  let name;

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name });
  };

  it('should return 401 when the token is not provide', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 when the token is invalid', async () => {
    token = 'a';

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
