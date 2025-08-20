import Base from '../models/Base.js';
import EquipmentType from '../models/EquipmentType.js';

export const listBases = async (req, res) => {
  const items = await Base.find({}).sort('name');
  res.json(items);
};

export const listEquipmentTypes = async (req, res) => {
  const items = await EquipmentType.find({}).sort('name');
  res.json(items);
};
