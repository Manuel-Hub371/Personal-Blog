require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config();

// Connect to database
// Database connection handled in start function

const app = express();


// Admin Seeding Logic
const seedAdmin = async () => {
    try {
        const User = require('./models/User');
        const userExists = await User.findOne({ email: '94jnr200@gmail.com' });
        if (!userExists) {
            await User.create({
                name: 'Admin',
                email: '94jnr200@gmail.com',
                password: 'Darkovybz123', // Will be hashed by pre-save middlware
                bio: 'Professional Blog Administrator'
            });
            console.log('Admin user created');
        }
    } catch (error) {
        console.error('Admin seeding failed:', error);
    }
};
// Execution handled in start function

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Serve static assets from frontend
app.use(express.static(path.join(__dirname, '../frontend')));


// Fallback for non-API routes to serve index.html
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.resolve(__dirname, '../frontend', 'index.html'));
    } else {
        next();
    }
});

// Error handling middleware (basic)
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const cron = require('node-cron');
const { cleanupOldMessages } = require('./controllers/contactController');

// Schedule Cleanup Job (Every midnight)
cron.schedule('0 0 * * *', () => {
    cleanupOldMessages();
});

const PORT = process.env.PORT || 5000;




const startServer = async () => {
    try {
        await connectDB();
        await seedAdmin();
        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();