import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@campus.com';
    const adminPassword = 'Admin@123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      existing.set({ isAdmin: true, password: hashedPassword });
      await existing.save();
      console.log(`✅ Admin updated: ${adminEmail}`);
    } else {
      await User.create({ name: 'Admin', email: adminEmail, password: hashedPassword, isAdmin: true });
      console.log(`✅ Admin created: ${adminEmail}`);
    }

    console.log(`📝 Email: ${adminEmail}`);
    console.log(`📝 Password: ${adminPassword}`);
    await mongoose.connection.close();
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
