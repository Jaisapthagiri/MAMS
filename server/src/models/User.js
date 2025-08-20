import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'commander', 'logistics'], required: true },
  base: { type: mongoose.Schema.Types.ObjectId, ref: 'Base', required: function(){return this.role !== 'admin';} },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
