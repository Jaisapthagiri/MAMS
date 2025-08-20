import mongoose from 'mongoose';
const equipmentTypeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, default: 'units' } // e.g., 'pcs', 'vehicles', 'rounds'
}, { timestamps: true });
export default mongoose.model('EquipmentType', equipmentTypeSchema);
