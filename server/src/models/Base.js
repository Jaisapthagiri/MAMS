import mongoose from 'mongoose';
const baseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });
export default mongoose.model('Base', baseSchema);
