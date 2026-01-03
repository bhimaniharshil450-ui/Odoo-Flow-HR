#!/bin/bash

echo "========================================"
echo "  DayFlow Harmony - Starting Services"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/4] Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd server
    npm install
    cd ..
fi

echo ""
echo "[2/4] Starting Backend Server..."
cd server
npm run dev &
BACKEND_PID=$!
cd ..

sleep 2

echo "[3/4] Starting Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "[4/4] Services Started!"
echo "========================================"
echo "  Backend:  http://localhost:3001"
echo "  Frontend: http://localhost:8080"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services..."

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for both processes
wait
