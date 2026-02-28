#!/bin/bash

# Navigate to script directory
cd "$(dirname "$0")" || exit

echo "=================================================="
echo "      🧭 THE COMPASS IS STARTING (LINUX)"
echo "=================================================="

# 1. Start the Brain (Backend Server)
echo "1. Waking up the Brain (Server)..."
cd server
node index.js &
SERVER_PID=$!
cd ..

# Wait a moment
sleep 2

# 2. Open the Browser
echo "2. Opening the Mirror..."
# Try generic xdg-open first
if which xdg-open > /dev/null; then
  (sleep 2 && xdg-open http://localhost:5173) &
else
  echo "Could not detect web browser. Please open http://localhost:5173 manually."
fi

# 3. Start the Interface
echo "3. Launching Interface..."
echo "--------------------------------------------------"
echo "Press CTRL+C to close the Compass."
echo "--------------------------------------------------"

npm run dev

# Cleanup
kill $SERVER_PID
echo "Compass shutdown complete. Goodbye."
