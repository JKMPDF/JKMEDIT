# Use Node Alpine (Lightweight)
FROM node:18-alpine

# Set working folder inside the container
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache ffmpeg python3

# --- CRITICAL CHANGE HERE ---
# Only copy package.json (Ignore package-lock.json to prevent errors)
COPY package.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000
# ... existing lines ...

# Disable YTDL Update Check to reduce errors
ENV YTDL_NO_UPDATE=1

# Start the server
CMD ["node", "index.js"]
