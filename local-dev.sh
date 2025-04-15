#!/bin/bash

echo "Starting local development environment..."

# Остановка и удаление контейнеров, если они уже запущены
docker-compose -f docker-compose.local.yml down

# Экспорт переменных окружения из .env.local
export $(grep -v '^#' .env.local | xargs)

# Запуск docker-compose с текущими переменными окружения
docker-compose -f docker-compose.local.yml up --build

# При завершении скрипта остановить контейнеры
# Этот код выполнится только если пользователь прервет скрипт (Ctrl+C)
trap "docker-compose -f docker-compose.local.yml down" EXIT