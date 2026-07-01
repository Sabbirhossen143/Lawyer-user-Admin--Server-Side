const express = require("express");
const {
  hireRequestsCollection,
  notificationsCollection,
} = require("../config/collections");
const router = express.Router();
const { ObjectId } = require("mongodb");


router.get("/user-request/:id", async (req, res) => {
  const result =
    await hireRequestsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

  res.send(result);
});

router.post("/", async (req, res) => {
  try {
    const requestData = req.body;

    const result =
      await hireRequestsCollection.insertOne(
        requestData
      );

    await notificationsCollection.insertOne({
      title: "New Hire Request",
      message: `${requestData.userName} hired ${requestData.lawyerName}`,
      type: "hire_request",
      isRead: false,
      createdAt: new Date(),
    });

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const result =
      await hireRequestsCollection
        .find()
        .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { ObjectId } =
    require("mongodb");

  const result =
    await hireRequestsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
        },
      }
    );

  res.send(result);
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { ObjectId } =
      require("mongodb");

    const result =
      await hireRequestsCollection.deleteOne({
        _id: new ObjectId(id),
      });

    res.send(result);

  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user/:email", async (req, res) => {
  const result =
    await hireRequestsCollection
      .find({
        userEmail: req.params.email,
      })
      .toArray();

  res.send(result);
});

router.get(
  "/lawyer/:email",
  async (req, res) => {

    const result =
      await hireRequestsCollection
        .find({
          lawyerEmail:
            req.params.email,
        })
        .sort({
          createdAt: -1,
        })
        .toArray();

    res.send(result);
  }
);

module.exports = router;