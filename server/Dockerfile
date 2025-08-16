# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Clean up
RUN npm cache clean --force

# Set environment variables
ENV NODE_ENV=production

# JWT Configuration
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRATION=${JWT_EXPIRATION:-1d}

# Database Configuration
ENV DATABASE_URL=${DATABASE_URL}

# db
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}

# Server Configuration
ENV PORT=${PORT:-5001}
ENV NODE_ENV=${NODE_ENV:-development}
ENV TYPEORM_LOGGING=${TYPEORM_LOGGING:-true}

EXPOSE 5001

CMD ["npm", "run", "start:prod"]
