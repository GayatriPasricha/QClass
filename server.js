
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./src/config/db');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

// Middleware
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use(express.json());

// Pass io to request object (declared BEFORE routes so it's accessible inside route handlers)
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
const authRoutes = require('./src/routes/authRoutes');
const classroomRoutes = require('./src/routes/classroomRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const userRoutes = require('./src/routes/userRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Centralized error handler middleware (must be registered AFTER all routes)
const { errorHandler } = require('./src/middleware/errorMiddleware');
app.use(errorHandler);

// Socket handlers
const socketHandlers = require('./src/sockets/socketHandlers');
socketHandlers(io);

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('QClass API is running...');
});

const initialPort = parseInt(process.env.PORT || '5000', 10);

server.on('listening', () => {
    const address = server.address();
    const boundPort = typeof address === 'string' ? address : address?.port;
    console.log(`Server successfully started and running on port ${boundPort}`);
});

const startServer = (port) => {
    server.removeAllListeners('error');
    
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.warn(`[WARNING] Port ${port} is already in use.`);
            const nextPort = port + 1;
            console.log(`[INFO] Retrying to start server on fallback port ${nextPort}...`);
            startServer(nextPort);
        } else {
            console.error('[CRITICAL] Server startup failed with error:', err);
            process.exit(1);
        }
    });

    server.listen(port);
};

startServer(initialPort);
