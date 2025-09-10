# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# If you have package.json, install dependencies
# RUN npm install

# Expose port (adjust if your game uses different port)
EXPOSE 3000

# Start the application
# Adjust this command based on how your snake ladder game starts
CMD ["node", "index.js"]

# If it's an HTML game, use a simple web server:
# CMD ["npx", "http-server", ".", "-p", "3000"]
