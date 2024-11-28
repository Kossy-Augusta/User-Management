const mongoose = require('mongoose');
const{ Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
    type: [String],
    enum: ['User', 'Admin', 'Editor'],
    default: ['User']  // Default role is 'User'
    },
    refresh_token: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

module.exports = mongoose.model('User', userSchema)