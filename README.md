# OAuth Frontend

A React-based frontend application for OAuth authentication, built with Vite and TypeScript.

## Features

- Google OAuth authentication
- User profile display
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
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
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
docker run -d -p 3007:3007 -e VITE_GOOGLE_CLIENT_ID=your_google_client_id --name oauth-frontend oauth-frontend:latest
```

### Using Docker Compose

```bash
# Start the service
VITE_GOOGLE_CLIENT_ID=your_google_client_id docker-compose up -d

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
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID

## Adding Additional OAuth Providers

To add more OAuth providers:

1. Create a new configuration in `src/config/oauth-providers.ts`
2. Add the provider-specific authentication logic
3. Update the login UI to include the new provider
4. Set up the necessary environment variables

## License

[MIT](LICENSE)
