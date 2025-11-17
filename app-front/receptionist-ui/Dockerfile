# -------------------------
# 1) Builder Stage
# -------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source
COPY . .

# Build Next.js app
RUN npm run build

# -------------------------
# 2) Runner Stage
# -------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy build output from builder
COPY --from=builder /app/ ./

# Expose port
EXPOSE 3000

# Run production server
CMD ["npm", "start"]
