import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Mock attendance data
let attendanceRecords = [
    {
        id: 1,
        employeeId: 2,
        date: new Date().toISOString().split('T')[0],
        checkIn: '09:00',
        checkOut: '18:00',
        status: 'present',
        hoursWorked: 9
    }
];

// Get all attendance records
router.get('/', authenticateToken, (req, res) => {
    const { employeeId } = req.query;

    let records = attendanceRecords;

    if (employeeId) {
        records = records.filter(r => r.employeeId === parseInt(employeeId));
    }

    res.json(records);
});

// Check in
router.post('/checkin', authenticateToken, (req, res) => {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const existingRecord = attendanceRecords.find(
        r => r.employeeId === employeeId && r.date === today
    );

    if (existingRecord) {
        return res.status(400).json({ error: 'Already checked in today' });
    }

    const newRecord = {
        id: attendanceRecords.length + 1,
        employeeId,
        date: today,
        checkIn: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        checkOut: null,
        status: 'present',
        hoursWorked: 0
    };

    attendanceRecords.push(newRecord);
    res.status(201).json(newRecord);
});

// Check out
router.post('/checkout', authenticateToken, (req, res) => {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const record = attendanceRecords.find(
        r => r.employeeId === employeeId && r.date === today
    );

    if (!record) {
        return res.status(400).json({ error: 'No check-in record found for today' });
    }

    if (record.checkOut) {
        return res.status(400).json({ error: 'Already checked out today' });
    }

    record.checkOut = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    // Calculate hours worked
    const checkInTime = new Date(`${today} ${record.checkIn}`);
    const checkOutTime = new Date(`${today} ${record.checkOut}`);
    record.hoursWorked = Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60) * 10) / 10;

    res.json(record);
});

export default router;
