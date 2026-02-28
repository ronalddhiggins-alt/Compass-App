#!/bin/bash

# Navigate to the folder where this script lives
cd "$(dirname "$0")" || exit

echo "=================================================="
echo "      🧭 THE COMPASS IS STARTING..."
echo "=================================================="

# 1. Start the Brain (Backend Server)
echo "1. Waking up the Brain (Server)..."
cd server
node index.js &
SERVER_PID=$!
cd ..

# Wait a moment for the server to wake up
sleep 2

# 2. Open the Browser
echo "2. Opening the Mirror..."
(sleep 4 && open http://localhost:5173) &

# 3. Start the Interface (Frontend)
echo "3. Launching Interface..."
echo "--------------------------------------------------"
echo "Press CTRL+C to close the Compass."
echo "--------------------------------------------------"

# Run the dev server
npm run dev

# When the user closes the app (CTRL+C), kill the backend server too
kill $SERVER_PID
echo "Compass shutdown complete. Goodbye."
