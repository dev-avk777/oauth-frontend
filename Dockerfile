FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install
COPY . .

# Сборка приложения - переменные окружения из .env.production
# будут подставлены во время сборки образа
RUN pnpm run build

# Expose port
EXPOSE 3007

# Add health check to verify container is healthy
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3007/ || exit 1

# Настройка скрипта запуска для использования переменных окружения во время выполнения
CMD sh -c 'if [ -n "$VITE_GOOGLE_CLIENT_ID" ]; then echo "Using VITE_GOOGLE_CLIENT_ID from environment"; else echo "WARNING: VITE_GOOGLE_CLIENT_ID not set"; fi && pnpm exec vite preview --host --port 3007'
