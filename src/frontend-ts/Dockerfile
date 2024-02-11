# Use an official Node.js runtime as the base image
FROM node:21-alpine

ENV PATH ./node_modules/.bin:$PATH

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the remaining project files to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]