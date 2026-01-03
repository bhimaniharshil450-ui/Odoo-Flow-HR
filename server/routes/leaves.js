import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock leave data
let leaveRequests = [
    {
        id: 1,
        employeeId: 2,
        employeeName: 'John Doe',
        type: 'sick',
        startDate: '2026-01-10',
        endDate: '2026-01-12',
        reason: 'Medical appointment',
        status: 'pending',
        createdAt: new Date().toISOString()
    }
];

// Get all leave requests
router.get('/', authenticateToken, (req, res) => {
    const { employeeId, status } = req.query;

    let requests = leaveRequests;

    if (employeeId) {
        requests = requests.filter(r => r.employeeId === parseInt(employeeId));
    }

    if (status) {
        requests = requests.filter(r => r.status === status);
    }

    res.json(requests);
});

// Create leave request
router.post('/', authenticateToken, (req, res) => {
    const { employeeId, employeeName, type, startDate, endDate, reason } = req.body;

    if (!employeeId || !type || !startDate || !endDate || !reason) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newRequest = {
        id: leaveRequests.length + 1,
        employeeId,
        employeeName,
        type,
        startDate,
        endDate,
        reason,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    leaveRequests.push(newRequest);
    res.status(201).json(newRequest);
});

// Update leave request status
router.patch('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const request = leaveRequests.find(r => r.id === parseInt(id));

    if (!request) {
        return res.status(404).json({ error: 'Leave request not found' });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    request.status = status;
    res.json(request);
});

// Delete leave request
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = leaveRequests.findIndex(r => r.id === parseInt(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Leave request not found' });
    }

    leaveRequests.splice(index, 1);
    res.json({ message: 'Leave request deleted successfully' });
});

export default router;
