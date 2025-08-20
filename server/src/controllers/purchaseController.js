import Purchase from '../models/Purchase.js';

export const createPurchase = async (req, res) => {
  const { base, equipmentType, quantity, purchasedAt, note } = req.body;
  const doc = await Purchase.create({ base, equipmentType, quantity, purchasedAt, note, createdBy: req.user._id });
  res.status(201).json(doc);
};

export const getPurchases = async (req, res) => {
  const { start, end, base, equipmentType } = req.query;
  const q = {};
  if (base) q.base = base;
  if (equipmentType) q.equipmentType = equipmentType;
  if (start || end) q.purchasedAt = {};
  if (start) q.purchasedAt.$gte = new Date(start);
  if (end) q.purchasedAt.$lte = new Date(end);
  const items = await Purchase.find(q).populate('base equipmentType createdBy').sort('-purchasedAt');
  res.json(items);
};
