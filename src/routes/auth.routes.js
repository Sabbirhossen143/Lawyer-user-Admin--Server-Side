const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth Route Working");
});

router.post("/jwt", async (req, res) => {
  const user = req.body;

  const token = jwt.sign(
    user,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.send({ token });
});

module.exports = router;