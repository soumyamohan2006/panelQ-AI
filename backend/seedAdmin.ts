import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@campus.com';
    const adminPassword = 'Admin@123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.isAdmin = true;
      await admin.save();
      console.log(`✅ Admin privileges granted to ${adminEmail}`);
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log(`✅ Admin user created: ${adminEmail}`);
      console.log(`📝 Password: ${adminPassword}`);
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
