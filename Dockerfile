FROM node:18-alpine

WORKDIR /app

# Копируем только package.json, lock-файл и .env.production
COPY package.json pnpm-lock.yaml ./
COPY .env.production .env.production

# Устанавливаем pnpm, зависимости и curl
RUN npm install -g pnpm \
  && pnpm install \
  && apk add --no-cache curl

# Копируем остальной код
COPY . .

# Собираем фронтенд
RUN pnpm build

# Открываем порт и запускаем preview-сервер
EXPOSE 3007
CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "3007"]
