const Record = require('../models/Record');
const Joi = require('joi');

exports.createRecord = async (req, res) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    type: Joi.string().valid('Income', 'Expense').required(),
    category: Joi.string().required(),
    date: Joi.date(),
    notes: Joi.string().allow('', null)
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const record = await Record.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    let query = { isDeleted: false };
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Record.find(query)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Record.countDocuments(query);

    res.json({ success: true, count: records.length, total, page, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    let record = await Record.findById(req.params.id);
    if (!record || record.isDeleted) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record || record.isDeleted) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    // Soft delete
    record.isDeleted = true;
    await record.save();
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};