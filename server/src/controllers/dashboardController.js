import Purchase from '../models/Purchase.js';
import Transfer from '../models/Transfer.js';
import Assignment from '../models/Assignment.js';
import Expenditure from '../models/Expenditure.js';import mongoose from "mongoose";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getDashboard = async (req, res) => {
  const { start, end, baseId, equipmentTypeId } = req.query;
  const startDate = start ? new Date(start) : new Date("1900-01-01");
  const endDate = end ? new Date(end) : new Date();

  const baseFilter = baseId && isValidObjectId(baseId) ? { base: baseId } : {};
  const typeFilter = equipmentTypeId ? { equipmentType: equipmentTypeId } : {};

  const sum = (docs, field = "quantity") =>
    docs.reduce((a, b) => a + (b[field] || 0), 0);

  // Purchases
  const purchasesBefore = await Purchase.find({
    ...baseFilter,
    ...typeFilter,
    purchasedAt: { $lt: startDate },
  });
  const purchasesInRange = await Purchase.find({
    ...baseFilter,
    ...typeFilter,
    purchasedAt: { $gte: startDate, $lte: endDate },
  });

  // Transfers (safe filter for baseId)
  const transferFilterIn = {
    ...(isValidObjectId(baseId) ? { toBase: baseId } : {}),
    ...(equipmentTypeId ? { equipmentType: equipmentTypeId } : {}),
  };
  const transferFilterOut = {
    ...(isValidObjectId(baseId) ? { fromBase: baseId } : {}),
    ...(equipmentTypeId ? { equipmentType: equipmentTypeId } : {}),
  };

  const transfersInBefore = await Transfer.find({
    ...transferFilterIn,
    transferredAt: { $lt: startDate },
  });
  const transfersOutBefore = await Transfer.find({
    ...transferFilterOut,
    transferredAt: { $lt: startDate },
  });

  const transfersInRange = await Transfer.find({
    ...transferFilterIn,
    transferredAt: { $gte: startDate, $lte: endDate },
  });
  const transfersOutRange = await Transfer.find({
    ...transferFilterOut,
    transferredAt: { $gte: startDate, $lte: endDate },
  });

  // Assignments & Expenditures
  const assignmentsInRange = await Assignment.find({
    ...baseFilter,
    ...typeFilter,
    assignedAt: { $gte: startDate, $lte: endDate },
  });
  const expendituresInRange = await Expenditure.find({
    ...baseFilter,
    ...typeFilter,
    expendedAt: { $gte: startDate, $lte: endDate },
  });

  const opening =
    sum(purchasesBefore) + sum(transfersInBefore) - sum(transfersOutBefore);
  const netMovement =
    sum(purchasesInRange) + sum(transfersInRange) - sum(transfersOutRange);
  const closing =
    opening +
    netMovement -
    sum(expendituresInRange) -
    sum(assignmentsInRange);

  res.json({
    range: { start: startDate, end: endDate },
    metrics: {
      opening,
      netMovement,
      closing,
      assigned: sum(assignmentsInRange),
      expended: sum(expendituresInRange),
    },
    breakdown: {
      purchases: sum(purchasesInRange),
      transferIn: sum(transfersInRange),
      transferOut: sum(transfersOutRange),
    },
  });
};
