const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();
const {
  transactionsCollection,
  notificationsCollection,
} = require("../config/collections");
const Stripe = require("stripe");

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

router.post(
  "/create-payment-intent",
  async (req, res) => {

    try {

      const { amount } = req.body;

      const paymentIntent =
        await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "usd",
          payment_method_types: ["card"],
        });

      res.send({
        clientSecret:
          paymentIntent.client_secret,
      });

    } catch (error) {
      console.log("FULL ERROR:");
  console.log(error);

  console.log("ERROR MESSAGE:");
  console.log(error.message);
      res.status(500).send({
        message: error.message,
      });

    }
  }
);

// Create Transaction (Payment Success)
router.post("/", async (req, res) => {
  try {
    const transaction = {
      ...req.body,
       status: "paid",
      paidAt: new Date(),
    };

    const result =
      await transactionsCollection.insertOne(
        transaction
      );
    
    await notificationsCollection.insertOne({
  title: "Payment Completed",
  message: `${transaction.userName} paid ৳${transaction.amount}`,
  type: "payment",
  isRead: false,
  createdAt: new Date(),
});

    res.send(result);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


// Get All Transactions
router.get("/", async (req, res) => {
  try {
    const result =
      await transactionsCollection
        .find()
        .sort({ paidAt: -1 })
        .toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


// Get Transactions By Lawyer Email
router.get(
  "/lawyer/:email",
  async (req, res) => {
    try {
      const result =
        await transactionsCollection
          .find({
            lawyerEmail:
              req.params.email,
          })
          .sort({
            paidAt: -1,
          })
          .toArray();

      res.send(result);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);


// Get Transactions By User Email
router.get(
  "/user/:email",
  async (req, res) => {
    try {
      const result =
        await transactionsCollection
          .find({
            userEmail:
              req.params.email,
          })
          .sort({
            paidAt: -1,
          })
          .toArray();

      res.send(result);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);


// Get Single Transaction
router.get(
  "/:id",
  async (req, res) => {
    try {
      const result =
        await transactionsCollection.findOne({
          _id: new ObjectId(
            req.params.id
          ),
        });

      res.send(result);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);


// Delete Transaction (Optional)
router.delete(
  "/:id",
  async (req, res) => {
    try {
      const result =
        await transactionsCollection.deleteOne({
          _id: new ObjectId(
            req.params.id
          ),
        });

      res.send(result);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;