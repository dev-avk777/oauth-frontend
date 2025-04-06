# Настройка секретов для GitHub Actions

Для успешного деплоя приложения с помощью GitHub Actions необходимо настроить следующие секреты в настройках репозитория:

## Обязательные секреты

1. **GITLAB_USER** - имя пользователя GitLab для доступа к Container Registry
2. **GITLAB_TOKEN** - токен доступа к GitLab Container Registry
3. **SERVER_IP** - IP-адрес сервера для деплоя
4. **SERVER_USER** - имя пользователя для SSH-подключения к серверу
5. **SERVER_SSH_KEY** - приватный SSH-ключ для подключения к серверу
6. **VITE_GOOGLE_CLIENT_ID** - ID клиента Google OAuth

## Опциональные секреты

1. **SERVER_PORT** - порт для SSH-подключения (по умолчанию 22)

## Как настроить секреты

1. Перейдите в настройки репозитория на GitHub: `Settings` -> `Secrets and variables` -> `Actions`
2. Нажмите `New repository secret`
3. Добавьте все необходимые секреты с соответствующими значениями

## Получение значений для секретов

### GITLAB_USER и GITLAB_TOKEN
1. Войдите в свой аккаунт GitLab
2. Перейдите в `Preferences` -> `Access Tokens`
3. Создайте новый токен с правами `read_registry` и `write_registry`

### SERVER_SSH_KEY
1. Сгенерируйте SSH-ключ на вашем компьютере, если его еще нет
2. Добавьте публичный ключ на сервер в файл ~/.ssh/authorized_keys
3. Вставьте полное содержимое приватного ключа в секрет SERVER_SSH_KEY

### VITE_GOOGLE_CLIENT_ID
1. Создайте проект в [Google Cloud Console](https://console.cloud.google.com/)
2. Настройте OAuth consent screen
3. Создайте учетные данные OAuth 2.0 и скопируйте Client ID