const express = require("express");
const router = express.Router();

const {
  usersCollection,
  lawyersCollection,
  hireRequestsCollection,
  transactionsCollection,
} = require("../config/collections");

router.get("/", async (req, res) => {
  try {
    const users = await usersCollection.find().toArray();
    const lawyers = await lawyersCollection.find().toArray();
    const hires = await hireRequestsCollection.find().toArray();
    const transactions = await transactionsCollection.find().toArray();

    // --- 1. Revenue Calculations ---
    const totalRevenue = transactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const monthlyRevenueMap = {};
    transactions.forEach((t) => {
      const date = new Date(t.paidAt);
      const month = date.toLocaleString("en-US", { month: "short" });
      if (!monthlyRevenueMap[month]) {
        monthlyRevenueMap[month] = 0;
      }
      monthlyRevenueMap[month] += Number(t.amount || 0);
    });

    const monthlyRevenue = Object.entries(monthlyRevenueMap).map(
      ([month, revenue]) => ({ month, revenue })
    );

    // --- 2. Top Lawyers Calculation ---
    const lawyerRevenue = {};
    transactions.forEach((t) => {
      if (!lawyerRevenue[t.lawyerEmail]) {
        lawyerRevenue[t.lawyerEmail] = 0;
      }
      lawyerRevenue[t.lawyerEmail] += Number(t.amount || 0);
    });

    const topLawyers = Object.entries(lawyerRevenue)
      .map(([email, revenue]) => ({ email, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // --- 3. Recent Transactions ---
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
      .slice(0, 5);

    // --- 4. User Growth (Fixed Scope) ---
    const monthlyUsersMap = {};
    users.forEach((u) => {
      const date = new Date(u.createdAt);
      const month = date.toLocaleString("en-US", { month: "short" });
      if (!monthlyUsersMap[month]) {
        monthlyUsersMap[month] = 0;
      }
      monthlyUsersMap[month]++;
    });

    const monthlyUsers = Object.entries(monthlyUsersMap).map(([month, users]) => ({
      month,
      users,
    }));

    // --- 5. Lawyer Growth (Fixed Scope) ---
    const monthlyLawyersMap = {};
    lawyers.forEach((l) => {
      const date = new Date(l.createdAt);
      const month = date.toLocaleString("en-US", { month: "short" });
      if (!monthlyLawyersMap[month]) {
        monthlyLawyersMap[month] = 0;
      }
      monthlyLawyersMap[month]++;
    });

    const monthlyLawyers = Object.entries(monthlyLawyersMap).map(([month, lawyers]) => ({
      month,
      lawyers,
    }));

    // --- 6. Hire Requests Trend (Fixed Scope) ---
    const monthlyHireMap = {};
    hires.forEach((h) => {
      const date = new Date(h.createdAt);
      const month = date.toLocaleString("en-US", { month: "short" });
      if (!monthlyHireMap[month]) {
        monthlyHireMap[month] = 0;
      }
      monthlyHireMap[month]++;
    });

    const monthlyHires = Object.entries(monthlyHireMap).map(([month, hires]) => ({
      month,
      hires,
    }));

    // --- 7. Send Combined Response ---
    res.send({
      totalUsers: users.length,
      totalLawyers: lawyers.length,
      totalHires: hires.length,
      totalRevenue,
      monthlyRevenue,
      topLawyers,
      recentTransactions,
      monthlyUsers,
      monthlyLawyers,
      monthlyHires,
    });

  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;