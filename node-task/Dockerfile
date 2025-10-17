# Base image for build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Add build dependencies
RUN apk add --no-cache python3 make g++

# Install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# =========================
# Runtime stage (production)
# =========================
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ENV PORT=
ENV HOST=0.0.0.0

# Install runtime dependencies needed for native modules
RUN apk add --no-cache libstdc++

# Copy only built files and dependencies from builder
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app
COPY --from=builder /app/config /app/config
# Expose port
EXPOSE 8000

# Start the app
CMD ["node", "dist/src/main.js"]