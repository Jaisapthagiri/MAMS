import mongoose from 'mongoose';
const assignmentSchema = new mongoose.Schema({
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: true },
  equipmentType: { type: mongoose.Schema.Types.ObjectId, ref: 'EquipmentType', required: true },
  quantity: { type: Number, required: true, min: 0 },
  assignedTo: { type: String, required: true }, // personnel identifier
  assignedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
export default mongoose.model('Assignment', assignmentSchema);
