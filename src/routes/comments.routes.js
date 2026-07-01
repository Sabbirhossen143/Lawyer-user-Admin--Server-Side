const express = require("express");

const router = express.Router();

const { ObjectId } =
  require("mongodb");

const {
  commentsCollection,
} = require("../config/collections");


router.get(
  "/lawyer/:id",
  async (req, res) => {

    const result =
      await commentsCollection
        .find({
          lawyerId:
            req.params.id,
        })
        .sort({
          createdAt: -1,
        })
        .toArray();

    res.send(result);
  }
);

router.get(
  "/",
  async (req, res) => {

    const result =
      await commentsCollection
        .find()
        .sort({
          createdAt: -1,
        })
        .toArray();

    res.send(result);
  }
);

// Add Comment
router.post("/", async (req, res) => {

  const comment =
    req.body;

  const result =
    await commentsCollection.insertOne(
      comment
    );

  res.send(result);
});

// Get User Comments
router.get(
  "/user/:email",
  async (req, res) => {

    const result =
      await commentsCollection
        .find({
          userEmail:
            req.params.email,
        })
        .toArray();

    res.send(result);
  }
);

// Update Comment
router.patch(
  "/:id",
  async (req, res) => {

    const result =
      await commentsCollection.updateOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        },
        {
          $set: {
            comment:
              req.body.comment,
          },
        }
      );

    res.send(result);
  }
);

// Delete Comment
router.delete(
  "/:id",
  async (req, res) => {

    const result =
      await commentsCollection.deleteOne(
        {
          _id:
            new ObjectId(
              req.params.id
            ),
        }
      );

    res.send(result);
  }
);

module.exports = router;