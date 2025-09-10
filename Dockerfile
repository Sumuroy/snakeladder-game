# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install http-server globally for serving static files
RUN npm install -g http-server

# Expose port
EXPOSE 3000

# Start a simple HTTP server
# This will serve your HTML/JS game files
CMD ["http-server", ".", "-p", "3000", "-a", "0.0.0.0"]
