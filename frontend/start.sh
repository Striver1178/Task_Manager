#!/bin/sh
PORT=${PORT:-3000}
echo "Starting frontend on port $PORT"
npx vite preview --host --port $PORT
