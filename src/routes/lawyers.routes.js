const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const {
  lawyersCollection,
} = require("../config/collections");

// Create Lawyer
router.post("/", async (req, res) => {
  try {
    const lawyer = req.body;

    const result = await lawyersCollection.insertOne(lawyer);

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to create lawyer",
    });
  }
});

// Get All Lawyers
router.get("/", async (req, res) => {
  try {
    const lawyers = await lawyersCollection.find().toArray();
    res.send(lawyers);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to load lawyers",
    });
  }
});

// Get Lawyer By Email
router.get("/email/:email", async (req, res) => {
  try {
    const lawyer = await lawyersCollection.findOne({
      email: req.params.email,
    });

    res.send(lawyer);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to load lawyer",
    });
  }
});

// Get Lawyer By ID
router.get("/:id", async (req, res) => {
  try {
    const lawyer = await lawyersCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    res.send(lawyer);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Invalid lawyer id",
    });
  }
});

// Update Lawyer
router.patch("/:id", async (req, res) => {
  try {
    const result = await lawyersCollection.updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: req.body,
      }
    );

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Failed to update lawyer",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result =
      await lawyersCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;