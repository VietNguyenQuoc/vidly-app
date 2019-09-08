const express = require("express");
const router = express.Router();
const { Genres, genreValidate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/objectid");
const { clearHash } = require("../startup/cache");
require("express-async-errors");
const path = require('path');
const fs = require('fs');

function stream(path) {
  const readStream = fs.createReadStream(path);
  return readStream;
}
router.get("/", async (req, res) => {
  const genre = await Genres.find()
    .sort({ name: 1 })
    .cache();

  res.send(genre);
  // res.send(`You have viewed this page ${req.session.views} times.`);
  // res.sendFile(path.resolve(__dirname + '/../image/logo.jpg'));
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genres.findById(req.params.id);

  if (!genre)
    return res.status(404).send(`Genre with id ${req.params.id} is not found.`);

  res.send(genre);
});

router.post("/", async (req, res) => {
  const { error } = genreValidate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const maxId = await Genres.find()
    .sort({ id: -1 })
    .select("id")
    .limit(1)
    .findOne();

  console.log(maxId);

  const genre = await new Genres({
    id: (maxId ? maxId.id : 0) + 1,
    name: req.body.name
  });

  await genre.save();
  clearHash("*genre*");
  res.send("Update new genre successfully.");
});

router.put("/:id", auth, validateObjectId, async (req, res) => {
  const { error } = genreValidate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // const genre = await Genres.findOneAndUpdate({ id: req.params.id }, {
  //     name: req.body.name
  // }, { new: true });

  const genre = await Genres.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) return res.status(404).send("Genre not found.");

  res.send(genre);
});

router.delete("/:id", auth, validateObjectId, async (req, res) => {
  const genre = await Genres.findByIdAndDelete(req.params.id);

  if (!genre) return res.status(404).send("Genre not found.");

  res.send(genre);
});

module.exports = router;
