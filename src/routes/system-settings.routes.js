const express = require("express");
const router = express.Router();

const {
  settingsCollection,
} = require("../config/collections");

router.get("/", async (req, res) => {
  try {
    const settings =
      await settingsCollection.findOne({});

    res.send(settings || {});
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const data = req.body;

    const result =
      await settingsCollection.updateOne(
        {},
        {
          $set: data,
        },
        {
          upsert: true,
        }
      );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = router;