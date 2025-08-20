import mongoose from 'mongoose';
const apiLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  method: String,
  path: String,
  status: Number,
  ip: String,
  body: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('ApiLog', apiLogSchema);
