FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .

# Application build - environment variables from .env.production
# will be substituted during image build
RUN pnpm run build

# Expose port
EXPOSE 3007

# Add health check to verify container is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3007/ || exit 1

# Start the application
CMD pnpm exec vite preview --host --port 3007
