##############################
# Build stage: install deps and compile Vite app
##############################
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Install dependencies first (leverages Docker layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the project and build production assets
COPY . .
RUN npm run build

##############################
# Runtime stage: serve static assets with nginx
##############################
FROM nginx:alpine AS runtime

# Copy custom nginx config tuned for SPA routing
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
