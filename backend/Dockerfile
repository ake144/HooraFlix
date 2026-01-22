# Stage 1: Build
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Stage 2: Production
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

# Expose port
EXPOSE 5000

# Start command
CMD ["npm", "run", "docker:init"]
