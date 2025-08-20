import mongoose from 'mongoose';
const expenditureSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true },
  quantity: { type: Number, required: true, min: 0 },
  expendedBy: { type: String, required: true }, // personnel identifier
  expendedAt: { type: Date, default: Date.now },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('Expenditure', expenditureSchema);
