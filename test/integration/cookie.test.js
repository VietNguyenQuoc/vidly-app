// const request = require('supertest');
const request = require('superagent');
const { Genres } = require('../../models/genre');
const mongoose = require('mongoose');
let server;
const { Users } = require('../../models/user');

describe('DELETE /', () => {

  beforeEach(() => { server = require('../../index') });

  afterEach(async () => {
    await server.close();
  })

  it('should return user when the cookie is available.', async () => {
    const user1 = request.agent();

    user1.get('/auth/google').send()

    console.log(res.status);
    expect(res.body).toMatchObject({ googleId: "107538067860246796426" });
  });
});