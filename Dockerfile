FROM node:18-alpine

WORKDIR /app

# Копировать только package.json и pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Устанавливаем pnpm, зависимости и curl в одном слое
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm \
  && pnpm install \
  && apk add --no-cache curl

# Затем копировать остальные файлы
COPY . .

# Собрать приложение
RUN pnpm build

# Команда запуска
EXPOSE 3007
CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "3007"]