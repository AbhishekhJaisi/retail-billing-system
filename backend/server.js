require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [
        'http://localhost:5173',
        'http://localhost:4173',
        'https://retail-billing-system-lyart.vercel.app',
      ];


// CORS must be configured BEFORE routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // only if you're sending cookies/auth headers
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Auth routes mounted only at /api/auth (no double-mounting)
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

const startServer = async () => {
    try {
        await Sequelize.authenticate();
        console.log('🚀 Database connected successfully.');

        app.listen(PORT, () => {
            console.log(`💻 Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ Unable to connect to the database or start server:', err);
        process.exit(1);
    }
};

startServer();
