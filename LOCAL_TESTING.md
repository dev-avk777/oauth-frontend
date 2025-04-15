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
- **Backend (Ethereum Key Vault API):** [http://localhost:5000](http://localhost:5000)
- **HashiCorp Vault (управление секретами):** [http://localhost:8200](http://localhost:8200)
- **База данных PostgreSQL:** доступна на localhost:5432

## Тестирование аутентификации с Email/Password

1. Откройте браузер и перейдите по адресу [http://localhost:3007](http://localhost:3007)
2. Введите email и пароль
3. Нажмите кнопку "Sign in"

## Тестирование подписания транзакций

1. Войдите в систему, используя email/password
2. Перейдите на страницу профиля
3. Нажмите кнопку "Sign Transaction"
4. Заполните форму с адресом получателя и суммой
5. Нажмите кнопку "Sign Transaction"

## Просмотр логов

Для просмотра логов контейнеров используйте:

```
docker logs ethereum-key-vault -f   # Логи бэкенда
docker logs oauth-frontend -f       # Логи фронтенда
docker logs ethereum-key-vault-db -f # Логи базы данных
docker logs vault -f               # Логи HashiCorp Vault
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

### Проблемы с Vault

Если возникают проблемы с инициализацией Vault:

1. Остановите контейнеры: `docker-compose -f docker-compose.local.yml down`
2. Удалите том Vault: `docker volume rm oauth-frontend_vault_data`
3. Запустите снова: `docker-compose -f docker-compose.local.yml up`