const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

const {
  notificationsCollection,
} = require("../config/collections");

router.get("/", async (req, res) => {
  const result =
    await notificationsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

  res.send(result);
});

router.patch("/:id", async (req, res) => {
  const result =
    await notificationsCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

  res.send(result);
});

router.delete("/:id", async (req, res) => {
  const result =
    await notificationsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

  res.send(result);
});

module.exports = router;