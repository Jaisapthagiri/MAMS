import Transfer from '../models/Transfer.js';

export const createTransfer = async (req, res) => {
  const { fromBase, toBase, equipmentType, quantity, transferredAt, note } = req.body;
  if (fromBase === toBase) return res.status(400).json({ message: 'fromBase and toBase must differ' });
  const doc = await Transfer.create({ fromBase, toBase, equipmentType, quantity, transferredAt, note, createdBy: req.user._id });
  res.status(201).json(doc);
};

export const getTransfers = async (req, res) => {
  const { start, end, base, equipmentType } = req.query;
  const q = {};
  if (equipmentType) q.equipmentType = equipmentType;
  if (base) {
    q.$or = [{ fromBase: base }, { toBase: base }];
  }
  if (start || end) q.transferredAt = {};
  if (start) q.transferredAt.$gte = new Date(start);
  if (end) q.transferredAt.$lte = new Date(end);
  const items = await Transfer.find(q).populate('fromBase toBase equipmentType createdBy').sort('-transferredAt');
  res.json(items);
};
