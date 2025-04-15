# Инструкция по локальному тестированию с Docker

## Подготовка

### Предварительные требования

1. Установленный Docker и Docker Compose
2. Клонированные репозитории:
   - `oauth-frontend` (этот репозиторий)
   - `ethereum-key-vault` (клонировать в соседнюю директорию)

### Структура директорий

```
parent-directory/
├── oauth-frontend/
└── ethereum-key-vault/
```

## Настройка Google OAuth для локального тестирования

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Перейдите в "APIs & Services" -> "Credentials"
4. Нажмите "Create Credentials" -> "OAuth client ID"
5. Выберите тип приложения "Web application"
6. Добавьте следующие URI перенаправления:
   - `http://localhost:3000/auth/google/callback`
7. Скопируйте полученные Client ID и Client Secret
8. Обновите эти данные в файле `.env.local`

## Запуск локального тестирования

### Windows

1. Откройте командную строку в директории `oauth-frontend`
2. Запустите скрипт `local-dev.bat`:
   ```
   .\local-dev.bat
   ```

### Linux/Mac

1. Откройте терминал в директории `oauth-frontend`
2. Сделайте скрипт `local-dev.sh` исполняемым:
   ```
   chmod +x local-dev.sh
   ```
3. Запустите скрипт:
   ```
   ./local-dev.sh
   ```

## Доступ к приложениям

После успешного запуска вы сможете получить доступ к следующим сервисам:

- **Frontend (OAuth Frontend):** [http://localhost:3007](http://localhost:3007)
- **Backend (Ethereum Key Vault API):** [http://localhost:3000](http://localhost:3000)
- **База данных PostgreSQL:** доступна на localhost:5432

## Тестирование OAuth аутентификации

1. Откройте браузер и перейдите по адресу [http://localhost:3007](http://localhost:3007)
2. Нажмите кнопку "Continue with Google"
3. Вы будете перенаправлены на страницу входа Google
4. После успешной аутентификации вы вернетесь в приложение на страницу профиля

## Тестирование аутентификации с Email/Password

1. Откройте браузер и перейдите по адресу [http://localhost:3007](http://localhost:3007)
2. Нажмите кнопку "Sign in with Email"
3. Введите email и пароль
4. Нажмите кнопку "Sign in"

## Просмотр логов

Для просмотра логов контейнеров используйте:

```
docker logs ethereum-key-vault -f  # Логи бэкенда
docker logs oauth-frontend -f      # Логи фронтенда
docker logs ethereum-key-vault-db -f # Логи базы данных
```

## Остановка окружения

Для остановки всех контейнеров используйте:

```
docker-compose -f docker-compose.local.yml down
```

## Устранение неполадок

### Проблемы с портами

Если какой-либо из портов уже используется, измените порты в `docker-compose.local.yml`:

```yaml
ports:
  - "новый_порт:исходный_порт"
```

### Проблемы с базой данных

Если вам нужно сбросить данные базы данных:

```
docker-compose -f docker-compose.local.yml down -v
```

Это удалит все тома Docker и при следующем запуске база данных будет создана заново.

### Проблемы с Google OAuth

Убедитесь, что URI перенаправления в Google Cloud Console точно совпадает с:
`http://localhost:3000/auth/google/callback`