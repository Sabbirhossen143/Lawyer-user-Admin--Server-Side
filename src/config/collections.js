const { client } = require("./db");

const db = client.db("lawyerHiringDB");

const usersCollection = db.collection("users");
const lawyersCollection = db.collection("lawyers");
const hireRequestsCollection = db.collection("hireRequests");
const commentsCollection = db.collection("comments");
const transactionsCollection = db.collection("transactions");
const notificationsCollection = db.collection("notifications");
const settingsCollection = db.collection("settings");

module.exports = {
  usersCollection,
  lawyersCollection,
  hireRequestsCollection,
  transactionsCollection,
  commentsCollection,
  notificationsCollection,
  settingsCollection,
};