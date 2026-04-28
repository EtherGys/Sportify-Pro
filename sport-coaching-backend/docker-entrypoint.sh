#!/bin/sh

echo "⏳ Waiting for DB..."

# (optionnel mais recommandé)
npx prisma db push

echo "📦 Running migrations/seed..."

npx prisma db seed

echo "🚀 Starting server..."

npm run dev