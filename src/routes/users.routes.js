const express = require("express");
const {
  usersCollection,
} = require("../config/collections");

const router = express.Router();

// GET
router.get("/", async (req, res) => {
  try {
    const users =
      await usersCollection
        .find()
        .toArray();

    res.send(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const user = req.body;

    const existingUser = await usersCollection.findOne({
      email: user.email,
    });

    if (existingUser) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    const result = await usersCollection.insertOne(user);

    res.send({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

// GET USER ROLE
router.get("/role/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await usersCollection.findOne({
      email,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      role: user.role,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

// GET USER BY EMAIL
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const user = await usersCollection.findOne({
      email,
    });

    res.send(user);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

// UPDATE USER
router.patch("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    const { name, photoURL } = req.body;

    const result = await usersCollection.updateOne(
      { email },
      {
        $set: {
          name,
          photoURL,
        },
      }
    );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      success: false,
      error: error.message,
    });
  }
});

router.patch("/role/:email", async (req, res) => {
  try {
    const result =
      await usersCollection.updateOne(
        { email: req.params.email },
        {
          $set: {
            role: req.body.role,
          },
        }
      );

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:email", async (req, res) => {
  try {
    const result =
      await usersCollection.deleteOne({
        email: req.params.email,
      });

    res.send(result);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;