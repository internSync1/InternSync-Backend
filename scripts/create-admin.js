const mongoose = require('mongoose');
require('dotenv').config();

// User model (simplified version for script)
const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  role: { type: String, enum: ['admin', 'applicant'], default: 'applicant' },
  isActive: { type: Boolean, default: true },
  firebaseUid: String
});

const User = mongoose.model('User', userSchema);

async function promoteToAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/internship-platform');
    console.log('Connected to MongoDB');

    // Find user by email and promote to admin
    const adminEmail = 'admin@internsync.com'; // Change this to your admin email
    
    const user = await User.findOneAndUpdate(
      { email: adminEmail },
      { 
        role: 'admin',
        isActive: true 
      },
      { new: true }
    );

    if (user) {
      console.log('✅ User promoted to admin successfully!');
      console.log('Admin user details:', {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        isActive: user.isActive
      });
    } else {
      console.log('❌ User not found. Please create the user account first.');
    }

  } catch (error) {
    console.error('Error promoting user to admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
promoteToAdmin();
