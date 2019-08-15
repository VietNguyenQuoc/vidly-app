const request = require('supertest');
const {Genres} = require('../../models/genre');
const mongoose = require('mongoose');
let server;
const {Users} = require('../../models/user');

describe('/api/genres ', () => {
  beforeEach(async () => { 
    server = require('../../index');
    await Genres.deleteMany({});
  });
  afterEach(async () => { await server.close(); });

  describe('GET /', () => {
    it('should return all the genre and status 200', async () => {
      await Genres.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get('/api/genres');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    it('should return a genre with specific given id and status 200', async () => {
      const genre = await new Genres({ name: "genre1" });
      await genre.save();

      const res = await request(server).get('/api/genres/'+genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'genre1');
    });

    it('should return a 404 status when genre is not found', async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const res = await request(server).get('/api/genres/' + invalidId);
      expect(res.status).toBe(404);
    });

    it('should return a 404 status when invalid id is given', async () => {
      const res = await request(server).get('/api/genres/1');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    it('should return 401 error if user doesnt log in.', async () => {
      const res = await request(server)
        .post('/api/genres')
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    it('should return 400 error if genre is less than 5 character.', async () => {
      const token = new Users().generateAuthToken();
      
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: "gena" });

      expect(res.status).toBe(400);
    });
    
    it('should return 400 error if genre is more than 255 character.', async () => {
      const token = new Users().generateAuthToken();
      
      const genre = new Array(257).join('a');

      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: genre });

      expect(res.status).toBe(400);
    });

    it('should save the genre if it is valid.', async () => {
      const token = new Users().generateAuthToken();
      
      const res = await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name: 'genre' });

      expect(res.status).toBe(200);
    });

  });

  describe('PUT /:id', () => {
    let token;
    let id;
    let name;

    beforeEach(() => { token = new Users().generateAuthToken(); });

    const exec = () => {
      return request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name });
    };

    it('should return 404 if the id is invalid.', async () => {
      id = 1;
      name = 'genre1';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if the genre is not found with the given id.', async () => {
      id = new mongoose.Types.ObjectId();
      name = 'genre1';

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 if the genre is found and update accordingly.', async () => {
      id = new mongoose.Types.ObjectId();
      name = 'genre2';

      const genre = new Genres({ _id: id, name: 'genre1' });
      await genre.save();

      const res = await exec();

      const query = await Genres.findById(id);

      expect(res.status).toBe(200);
      expect(query.name).toBe(name);
    });
  });

  describe('DELETE /', () => {
    let token;
    let id;

    beforeEach(() => { token = new Users().generateAuthToken(); });

    const exec = () => {
      return request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    };

    it('should return 404 if the genre is not found.', async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 200 if the genre is found and then properly delete that genre.', async () => {
      id = new mongoose.Types.ObjectId();
      const genre = new Genres({ _id: id, name: 'genre1' });
      await genre.save();

      const res = await exec();

      const query = await Genres.findById(id);

      expect(res.status).toBe(200);
      expect(query).toBeFalsy();
    });
  });
});