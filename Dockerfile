# Stage 1: Base Image & System Dependencies
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install Tesseract OCR engine and English language pack
# This is the magic step that fixes "OCR Failed" errors
RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng

# Stage 2: Application Setup
# Copy ONLY the backend's package definition files
COPY ocr-backend/package*.json ./

# Install the Node.js dependencies (express, multer, etc.)
RUN npm install --production

# Copy the rest of the backend's source code
COPY ocr-backend/ .

# Expose the port the app runs on
EXPOSE 3000

# The command to run when the container starts
CMD ["node", "index.js"]
