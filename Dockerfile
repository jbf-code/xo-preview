FROM node:22-slim

# Install Playwright system dependencies (cached layer — only rebuilds if Dockerfile changes)
RUN apt-get update && apt-get install -y \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libdbus-1-3 libxkbcommon0 \
    libatspi2.0-0 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2 \
    fonts-noto-color-emoji fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only package files first — npm install is cached unless dependencies change
COPY package.json package-lock.json* ./
RUN npm install --production

# Install Playwright Chromium — cached unless playwright version changes in package.json
RUN npx playwright install chromium

# Copy source code last — only this layer rebuilds on code changes
COPY . .

# Create data/previews dirs
RUN mkdir -p data previews

EXPOSE 3000

CMD ["node", "server.js"]
