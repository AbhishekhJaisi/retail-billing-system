require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Sequelize = require('./config/database');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);

app.use(cors({
    origin: 'http:localhost:5173',
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('API is running');
})

const startServer = async () => {
    try {
        await Sequelize.authenticate();
        console.log('🚀 Database connected successfully to Aiven Cloud.');

        app.listen(PORT, () => {
            console.log(`💻 Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error('❌ Unable to connect to the database or start server:', err); process.exit(1);
    }
};

startServer();

