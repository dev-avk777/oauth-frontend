FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build

# Create default .env file if not exists (will be overridden by environment variables)
RUN echo "VITE_GOOGLE_CLIENT_ID=default_placeholder" > .env

# Expose port
EXPOSE 3007

# Add health check to verify container is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3007/ || exit 1

# Use environment variables provided at runtime and start app listening on all interfaces
CMD ["pnpm", "exec", "vite", "preview", "--host", "--port", "3007"]
