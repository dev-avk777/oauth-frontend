# Instructions for Adding OAuth Frontend to an Existing docker-compose

To add OAuth Frontend to your existing server infrastructure, follow these steps:

## 1. Add the service to docker-compose.yml

Add the following block to the existing `docker-compose.yml` file on your server:

```yaml
# OAuth Frontend application
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

## 2. Add dependency to the nginx service

In the `depends_on` section of the `nginx` service, add `oauth-frontend`:

```yaml
depends_on:
  - umami
  - pool-creator
  - oauth-frontend
```

## 3. Create an environment variables file

Create or update the `.env` file in the directory where `docker-compose.yml` is located:

```
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

## 4. Update NGINX configuration (if necessary)

If you want the OAuth Frontend to be accessible via a domain, add the appropriate configuration to nginx:

Create a `nginx-oauth-frontend.conf` file in the nginx configurations directory:

```nginx
server {
    listen 80;
    server_name auth.your-domain.com;

    location / {
        proxy_pass http://oauth-frontend:3007;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

And add it to the mounting in the nginx service:

```yaml
volumes:
  - ./nginx.conf:/etc/nginx/nginx.conf:ro
  - ./nginx-oauth-frontend.conf:/etc/nginx/conf.d/nginx-oauth-frontend.conf:ro
  - ./certbot/conf:/etc/letsencrypt
  - ./certbot/www:/var/www/certbot
```

## 5. Start the service

After making all the changes, run the command:

```bash
docker-compose up -d oauth-frontend
```

## 6. Check the functionality

Verify that the service is up and running:

```bash
docker-compose ps oauth-frontend
```

Check the logs for errors:

```bash
docker-compose logs -f oauth-frontend
```