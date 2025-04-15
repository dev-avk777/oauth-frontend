# OAuth Frontend

A React-based frontend application for OAuth authentication, built with Vite and TypeScript.

## Features

- Integration with ethereum-key-vault API
- User profile display with Ethereum addresses
- Secure email/password authentication
- Responsive design with Tailwind CSS
- Docker containerization
- Automatic deployment via GitHub Actions

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm (preferred package manager)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/oauth-frontend.git
   cd oauth-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   VITE_AUTH_API_URL=http://localhost:5000
   VITE_FRONTEND_URL=http://localhost:3007
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## Building for Production

```bash
pnpm build
```

## Docker Setup

### Build and Run Locally

```bash
# Build the Docker image
docker build -t oauth-frontend:latest .

# Run the container
docker run -d -p 3007:3007 --name oauth-frontend oauth-frontend:latest
```

### Using Docker Compose

```bash
# Start the service
docker-compose up -d

# View logs
docker-compose logs -f
```

## Deployment

The application is automatically deployed using GitHub Actions when changes are pushed to the main branch.

### Deployment Process

1. Code is pushed to the main branch
2. GitHub Actions workflow is triggered
3. Application is built and tested
4. Docker image is built and pushed to GitLab Registry
5. The new image is deployed to the server via SSH

### Required GitHub Secrets

The following secrets need to be configured in the GitHub repository:

- `GITLAB_USER`: GitLab username
- `GITLAB_TOKEN`: GitLab personal access token
- `SERVER_IP`: Deployment server IP address
- `SERVER_USER`: SSH username
- `SERVER_SSH_KEY`: SSH private key
- `SERVER_PORT`: SSH port (optional, defaults to 22)

## Environment Variables

### Development

For local development, create a `.env.development` file in the project root with the following content:

```
VITE_AUTH_API_URL=http://localhost:5000
VITE_FRONTEND_URL=http://localhost:3007
```

### Production

For production builds, environment variables are passed through GitHub Actions from the repository secrets.

### Docker

When running the Docker container, environment variables are passed via the `-e` parameter:

```bash
docker run -d -p 3007:3007 -e VITE_AUTH_API_URL=http://api.example.com --name oauth-frontend oauth-frontend:latest
```

Or via the `.env` file when using docker-compose:

```bash
echo "VITE_AUTH_API_URL=http://api.example.com" > .env
docker-compose up -d
```

## License

[MIT](LICENSE)
