import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: 'User' },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  targetWeight: { type: Number, required: true },
  activityLevel: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
  dietPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Vegan'], required: true },
  allergies: { type: String, default: '' },
  budget: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);

