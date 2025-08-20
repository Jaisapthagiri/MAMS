import Expenditure from '../models/Expenditure.js';

export const createExpenditure = async (req, res) => {
  const { base, equipmentType, quantity, expendedBy, expendedAt, note } = req.body;
  const doc = await Expenditure.create({ base, equipmentType, quantity, expendedBy, expendedAt, note, createdBy: req.user._id });
  res.status(201).json(doc);
};

export const getExpenditures = async (req, res) => {
  const { start, end, base, equipmentType } = req.query;
  const q = {};
  if (base) q.base = base;
  if (equipmentType) q.equipmentType = equipmentType;
  if (start || end) q.expendedAt = {};
  if (start) q.expendedAt.$gte = new Date(start);
  if (end) q.expendedAt.$lte = new Date(end);
  const items = await Expenditure.find(q).populate('base equipmentType createdBy').sort('-expendedAt');
  res.json(items);
};
