const Record = require('../models/Record');

exports.getDashboardSummary = async (req, res) => {
  try {
    // We aggregate only active records
    const pipeline = [
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: "$type",
          totalAmount: { $sum: "$amount" }
        }
      }
    ];

    const totals = await Record.aggregate(pipeline);
    
    let totalIncome = 0;
    let totalExpense = 0;

    totals.forEach(t => {
      if (t._id === 'Income') totalIncome = t.totalAmount;
      if (t._id === 'Expense') totalExpense = t.totalAmount;
    });

    // Category breakdown for expenses
    const categoryBreakdown = await Record.aggregate([
      { $match: { isDeleted: false, type: 'Expense' } },
      { $group: { _id: "$category", totalAmount: { $sum: "$amount" } } },
      { $sort: { totalAmount: -1 } }
    ]);

    // Recent 5 transactions
    const recentActivity = await Record.find({ isDeleted: false })
      .sort({ date: -1 })
      .limit(5)
      .select('amount type category date');

    res.json({
      success: true,
      data: {
        totalIncome,
        totalExpenses: totalExpense,
        netBalance: totalIncome - totalExpense,
        expenseByCategory: categoryBreakdown,
        recentActivity
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};