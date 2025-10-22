#!/bin/bash

echo "🐾 Setting up Pet Service Marketplace Concept"
echo "==========================================="

# Check if PostgreSQL is running
echo "📋 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    echo "   On macOS: brew services start postgresql"
    echo "   On Ubuntu: sudo service postgresql start"
    exit 1
fi

# Create database if it doesn't exist
echo "📦 Creating database..."
createdb petservice_marketplace 2>/dev/null || echo "Database already exists"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Run migrations
echo "🗃️ Running database migrations..."
npm run db:migrate

echo "✅ Setup complete!"
echo ""
echo "🚀 Starting development servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "📝 Test accounts:"
echo "   admin@example.com    / admin     (OWNER)"
echo "   user@example.com     / user      (OWNER)"
echo "   provider@example.com / provider  (PROVIDER)"
echo ""

npm run dev
