#!/bin/bash

echo "=== PRIBEGA Build Script ==="

# Build frontend
echo "Building frontend..."
cd frontend
yarn install
yarn build
cd ..

echo "=== Build complete! ==="
