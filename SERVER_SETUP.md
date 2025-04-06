# Инструкция по добавлению OAuth Frontend в существующий docker-compose

Для добавления OAuth Frontend в существующую инфраструктуру сервера необходимо выполнить следующие шаги:

## 1. Добавить сервис в docker-compose.yml

Добавьте следующий блок в существующий файл `docker-compose.yml` на сервере:

```yaml
# OAuth Frontend приложение
oauth-frontend:
  image: registry.gitlab.com/store_images/docker-images/oauth-frontend:latest
  container_name: oauth-frontend
  restart: always
  ports:
    - "3007:3007"
  environment:
    - NODE_ENV=production
    - VITE_GOOGLE_CLIENT_ID=${VITE_GOOGLE_CLIENT_ID}
  networks:
    - webnet
  healthcheck:
    test: ["CMD", "wget", "-qO-", "http://localhost:3007/"]
    interval: 30s
    timeout: 5s
    retries: 3
    start_period: 5s
```

## 2. Добавить зависимость в nginx-сервис

В секции `depends_on` для сервиса `nginx` добавьте `oauth-frontend`:

```yaml
depends_on:
  - umami
  - pool-creator
  - oauth-frontend
```

## 3. Создать файл с переменными окружения

Создайте или обновите файл `.env` в директории, где находится `docker-compose.yml`:

```
VITE_GOOGLE_CLIENT_ID=ваш_идентификатор_клиента_google_oauth
```

## 4. Обновить NGINX-конфигурацию (при необходимости)

Если вы хотите, чтобы OAuth Frontend был доступен через домен, добавьте соответствующую конфигурацию в nginx:

Создайте файл `nginx-oauth-frontend.conf` в директории nginx конфигураций:

```nginx
server {
    listen 80;
    server_name auth.ваш-домен.ru;

    location / {
        proxy_pass http://oauth-frontend:3007;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

И добавьте его в монтирование в сервисе nginx:

```yaml
volumes:
  - ./nginx.conf:/etc/nginx/nginx.conf:ro
  - ./nginx-oauth-frontend.conf:/etc/nginx/conf.d/nginx-oauth-frontend.conf:ro
  - ./certbot/conf:/etc/letsencrypt
  - ./certbot/www:/var/www/certbot
```

## 5. Запуск сервиса

После внесения всех изменений выполните команду:

```bash
docker-compose up -d oauth-frontend
```

## 6. Проверка работоспособности

Проверьте, что сервис запущен и работает:

```bash
docker-compose ps oauth-frontend
```

Проверьте логи на наличие ошибок:

```bash
docker-compose logs -f oauth-frontend
```