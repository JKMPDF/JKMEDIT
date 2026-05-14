# Use Node Alpine
FROM node:18-alpine

# Set working folder
WORKDIR /app

# Install Python3 (Required for yt-dlp) and FFmpeg
RUN apk add --no-cache python3 ffmpeg curl

# Download the latest yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp

# Make it executable
RUN chmod a+rx /usr/local/bin/yt-dlp

# Copy package.json
COPY package.json ./

# Install Node dependencies
RUN npm install --production

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]