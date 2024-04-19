# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /matching-service

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port 3003 available to the world outside this container
EXPOSE 3003

# Define the command to run your app
CMD ["npm", "start"]
