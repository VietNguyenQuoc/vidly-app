const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const { Users } = require('../../models/user');
const mongoose = require('mongoose');

describe('/middleware/auth request block', () => {
  it('should return a decoded object from the JSON web token properly.', async () => {
    const payload = {
      email: 'a',
      name: 'a',
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    }
    const token = new Users(payload).generateAuthToken();

    const req = {
      header: jest.fn().mockReturnValue(token)
    };

    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(payload);
    expect(req.header).toBeCalledWith('x-auth-token');
    expect(next).toBeCalledTimes(1);
  })
})