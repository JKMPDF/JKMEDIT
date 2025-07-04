# Use Node.js base image
FROM node:18

# Install GraphicsMagick (required for pdf2pic)
RUN apt-get update && \
    apt-get install -y graphicsmagick

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files into container
COPY . .

# Expose port your server runs on
EXPOSE 10000

# Start the server
CMD ["node", "index.js"]
