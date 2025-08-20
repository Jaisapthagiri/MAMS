import mongoose from 'mongoose';
const transferSchema = new mongoose.Schema({
  fromBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  toBase: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true },
  quantity: { type: Number, required: true, min: 0 },
  transferredAt: { type: Date, default: Date.now },
  note: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('Transfer', transferSchema);
