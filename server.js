const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Atlas Cloud Database Connection with Updated Password
const MONGO_URI = 'mongodb+srv://xauusdrohitcom_db_user:xauusdrohit834825@cluster0.fpxuswn.mongodb.net/nexusnode-final?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('NexusNode Cloud Database Connected Successfully!'))
  .catch(err => console.log('Database Connection Error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// REGISTER ROUTE
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully in NexusNode!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to NexusNode Core Server!' });
});

// Server Port
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`NexusNode server is running on port ${PORT}`);
});