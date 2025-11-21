# Use Node Alpine (Lightweight)
FROM node:18-alpine

# Set working folder inside the container
WORKDIR /app

# Install system dependencies (FFmpeg is required for audio processing)
RUN apk add --no-cache ffmpeg python3

# Copy package files first (to cache dependencies)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]