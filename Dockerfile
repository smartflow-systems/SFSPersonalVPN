# ========================================
# Multi-stage Dockerfile for SFSPersonalVPN
# Stack: Node.js + Vite (Static Site)
# ========================================

# ----------------------------------------
# Stage 1: Build
# ----------------------------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci && \
    npm cache clean --force

# Copy source code
COPY . .

# Build static site with Vite
RUN npm run build

# ----------------------------------------
# Stage 2: Production - NGINX Server
# ----------------------------------------
FROM nginx:1.25-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy custom nginx configuration
COPY --chown=nginx:nginx <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing - serve index.html for all routes
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Copy built static files from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Use non-root nginx user
USER nginx

# Expose application port (using 8080 for non-root)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
