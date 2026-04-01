# Use Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of code
COPY . .

# Expose backend port
EXPOSE 4000

# Run server
CMD ["npm", "run", "dev"]