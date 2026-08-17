#!/bin/bash

# Frontend Deployment Script
echo "Starting frontend deployment..."

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}Pulling latest code...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to pull code${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Checking .env.production...${NC}"
if [ ! -f ".env.production" ]; then
    cat > .env.production << 'EOF'
VITE_API_URL=http://localhost:3000
VITE_FILES_URL=http://localhost:3000/uploads
EOF
fi

echo -e "\n${YELLOW}Installing dependencies...${NC}"
npm install || exit 1

echo -e "\n${YELLOW}Building for production...${NC}"
npm run build || exit 1

echo -e "\n${GREEN}Deployment finished!${NC}"
