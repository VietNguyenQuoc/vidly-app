const mongoose = require('mongoose');
const redis = require('redis');
const config = require('config');
const url = require('url');
const redisUrl = url.parse(process.env.REDIS_URL);
const client = redis.createClient(redisUrl.port, redisUrl.hostname, { no_ready_check: true });
const util = require('util');
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function () {
  this.isCache = true;
  return this;
}

mongoose.Query.prototype.exec = async function () {
  // Check if the query has been key anywhere in Redis
  if (this.isCache) {
    const key = JSON.stringify(
      Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name })
    );
    const redisCheck = await client.get(key);

    if (redisCheck) {
      console.log('Redis cache supernatural unlocked.')
      const doc = JSON.parse(redisCheck);

      return Array.isArray(doc) ?
        doc.map(d => new this.model(d)) :
        new this.model(doc);
    }

    // If no, execute normal MongoDB query
    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));

    return result;
  }
  console.log('MongoDB took its stage.')
  const result = await exec.apply(this, arguments);

  return result;
}

// Query -> Redis check -> MongoDB 
// Implement the cache mechanism inside the query execute method of mongoose model.

exports.redisClient = client;