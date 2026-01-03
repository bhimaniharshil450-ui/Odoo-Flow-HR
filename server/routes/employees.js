import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock employee data
const employees = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@dayflow.com',
        role: 'admin',
        department: 'Management',
        position: 'System Administrator',
        joinDate: '2024-01-01',
        phone: '+1234567890'
    },
    {
        id: 2,
        name: 'John Doe',
        email: 'employee@dayflow.com',
        role: 'employee',
        department: 'Engineering',
        position: 'Software Developer',
        joinDate: '2024-06-15',
        phone: '+1234567891'
    }
];

// Get all employees
router.get('/', authenticateToken, (req, res) => {
    // Remove password from response
    const sanitizedEmployees = employees.map(({ password, ...employee }) => employee);
    res.json(sanitizedEmployees);
});

// Get employee by ID
router.get('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const employee = employees.find(e => e.id === parseInt(id));

    if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    const { password, ...sanitizedEmployee } = employee;
    res.json(sanitizedEmployee);
});

// Update employee
router.patch('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const employeeIndex = employees.findIndex(e => e.id === parseInt(id));

    if (employeeIndex === -1) {
        return res.status(404).json({ error: 'Employee not found' });
    }

    employees[employeeIndex] = { ...employees[employeeIndex], ...updates };

    const { password, ...sanitizedEmployee } = employees[employeeIndex];
    res.json(sanitizedEmployee);
});

export default router;
