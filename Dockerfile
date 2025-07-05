# Stage 1: Base Image & System Dependencies
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies required for OCR:
# - tesseract-ocr: The main OCR engine
# - tesseract-ocr-data-eng: The English language data pack
# - poppler-utils: The CRUCIAL tool for converting PDF to images
RUN apk add --no-cache tesseract-ocr tesseract-ocr-data-eng poppler-utils

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
