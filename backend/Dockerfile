# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /usr/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Add this line to ensure compatibility
RUN npm rebuild sqlite3

# Copy the server code into the container
COPY . .

# Your app binds to port 5000
EXPOSE 5000

# Define the command to run your app
CMD ["node", "server.js"]
