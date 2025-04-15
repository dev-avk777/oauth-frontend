@echo off
echo Starting local development environment...

REM Остановка и удаление контейнеров, если они уже запущены
docker-compose -f docker-compose.local.yml down

REM Установка переменных окружения из .env.local
for /F "usebackq tokens=*" %%A in (.env.local) do (
    echo Setting: %%A
    set %%A
)

REM Запуск docker-compose с текущими переменными окружения
docker-compose -f docker-compose.local.yml up --build

REM Остановка контейнеров при завершении скрипта
REM Этот код выполнится только если пользователь прервет выполнение скрипта
docker-compose -f docker-compose.local.yml down