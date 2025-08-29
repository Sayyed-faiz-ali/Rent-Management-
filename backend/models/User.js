import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const familyMemberSchema = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    relation: { type: String, required: true },
});

const paymentSchema = mongoose.Schema({
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    rent: { type: Number, required: true },
    electricityBill: { type: Number, required: true },
    waterCharge: { type: Number, required: true },
    totalDue: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    balance: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
});

const messageSchema = mongoose.Schema({
    content: { type: String, required: true },
    from: { type: String, required: true, default: 'owner' },
    timestamp: { type: Date, default: Date.now },
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['owner', 'tenant'],
    },
    // Tenant specific fields
    houseNumber: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    familyMembers: [familyMemberSchema],
    payments: [paymentSchema],
    messages: [messageSchema],
}, {
    timestamps: true,
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
