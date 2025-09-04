const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // User Role and Status
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Emergency Settings
  emergencyMessage: {
    type: String,
    default: 'I am in an emergency situation. Please help me!'
  },
  trustedContacts: [{ 
    type: String // Storing phone numbers as strings
  }],
  
  // Location Data
  currentLocation: {
    latitude: Number,
    longitude: Number,
    address: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  
  // App Usage Data
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Only keep index for role (email and phoneNumber indexes are auto-created by unique: true)
userSchema.index({ role: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password (keeping your method name)
userSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Add a trusted contact (phone number) - keeping your method
userSchema.methods.addTrustedContact = async function(phoneNumber) {
  if (!this.trustedContacts.includes(phoneNumber)) {
    this.trustedContacts.push(phoneNumber);
    await this.save();
  }
};

// Remove a trusted contact (phone number) - keeping your method
userSchema.methods.removeTrustedContact = async function(phoneNumber) {
  this.trustedContacts = this.trustedContacts.filter(
    num => num !== phoneNumber
  );
  await this.save();
};

// Instance method to update location
userSchema.methods.updateLocation = function(latitude, longitude, address) {
  this.currentLocation = {
    latitude,
    longitude,
    address,
    lastUpdated: new Date()
  };
  return this.save();
};

// Transform output (remove sensitive data)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
