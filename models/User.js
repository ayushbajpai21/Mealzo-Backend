const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    displayName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    phoneNumber: {
        type: String
    },
    photoURL: {
        type: String
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true
    },
    address: {
        street: String,
        city: String,
        zipCode: String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
