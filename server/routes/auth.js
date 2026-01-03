import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Mock database (replace with real database in production)
const users = [
    {
        id: 1,
        email: 'admin@dayflow.com',
        password: '$2a$10$rZ5qYhH8qXKvkC5xGxJ8qOYvZxGxJ8qOYvZxGxJ8qOYvZxGxJ8qOY', // password: admin123
        name: 'Admin User',
        role: 'admin'
    },
    {
        id: 2,
        email: 'employee@dayflow.com',
        password: '$2a$10$rZ5qYhH8qXKvkC5xGxJ8qOYvZxGxJ8qOYvZxGxJ8qOYvZxGxJ8qOY', // password: admin123
        name: 'John Doe',
        role: 'employee'
    }
];

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            email,
            password: hashedPassword,
            name,
            role: role || 'employee'
        };

        users.push(newUser);

        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
