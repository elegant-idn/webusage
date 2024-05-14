# Use an official Node.js runtime as a parent image
FROM node:20-alpine

RUN apk add --no-cache wget \
    && wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

# Set the working directory
WORKDIR /usr/server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production


# Copy the server code into the container
COPY . .

# Your app binds to port 5000
EXPOSE 5000

# Define the command to run your app
CMD ["/usr/local/bin/dockerize", "-wait", "tcp://mysqldb:3306", "-timeout", "60s", "node", "server.js"]