#!/bin/bash
echo "🚀 TeamFlow Setup & Start"
echo ""

# Check if DATABASE_URL is set
if grep -q "PASTE_YOUR_NEON" backend/.env; then
  echo "❌ Please update DATABASE_URL in backend/.env first!"
  echo ""
  echo "   1. Go to https://neon.tech (free)"
  echo "   2. Create a project"
  echo "   3. Copy the connection string"
  echo "   4. Replace PASTE_YOUR_NEON_CONNECTION_STRING_HERE in backend/.env"
  echo ""
  exit 1
fi

echo "✅ .env found"
echo ""

# Run migrations
echo "📦 Running database migrations..."
node backend/src/db/migrate.js
if [ $? -ne 0 ]; then
  echo "❌ Migration failed. Check your DATABASE_URL."
  exit 1
fi

# Seed demo data
echo "🌱 Seeding demo data..."
node backend/src/db/seed.js
if [ $? -ne 0 ]; then
  echo "❌ Seed failed."
  exit 1
fi

echo ""
echo "✅ Database ready!"
echo ""
echo "📧 Demo Accounts:"
echo "   Admin  → admin@demo.com  / Demo@1234"
echo "   Member → jordan@demo.com / Demo@1234"
echo ""
echo "🌐 Starting servers..."
echo "   Backend  → http://localhost:5000"
echo "   Frontend → http://localhost:5173"
echo ""

# Start backend in background
node backend/src/index.js &
BACKEND_PID=$!

# Start frontend
npm run dev --prefix frontend

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
