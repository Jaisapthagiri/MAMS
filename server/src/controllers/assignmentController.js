import Assignment from '../models/Assignment.js';

export const createAssignment = async (req, res) => {
  const { base, equipmentType, quantity, assignedTo, assignedAt } = req.body;
  const doc = await Assignment.create({ base, equipmentType, quantity, assignedTo, assignedAt, createdBy: req.user._id });
  res.status(201).json(doc);
};

export const getAssignments = async (req, res) => {
  const { start, end, base, equipmentType } = req.query;
  const q = {};
  if (base) q.base = base;
  if (equipmentType) q.equipmentType = equipmentType;
  if (start || end) q.assignedAt = {};
  if (start) q.assignedAt.$gte = new Date(start);
  if (end) q.assignedAt.$lte = new Date(end);
  const items = await Assignment.find(q).populate('base equipmentType createdBy').sort('-assignedAt');
  res.json(items);
};
