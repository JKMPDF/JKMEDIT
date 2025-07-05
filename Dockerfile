# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Install poppler-utils, which is required by pdf-poppler
RUN apt-get update && apt-get install -y poppler-utils

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code
COPY . .

# Make your app's port available to the outside world
EXPOSE 3001

# Define the command to run your app
CMD [ "npm", "start" ]
