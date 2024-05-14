# Use an official Node runtime as a parent image
FROM node:20-alpine as build-stage

# Set the working directory in the container
WORKDIR /usr/client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build your app
RUN npm run build

FROM nginx:1.17.0-alpine

COPY --from=build-stage /usr/client/build /usr/share/nginx/html
EXPOSE 3000

CMD nginx -g 'daemon off;'
