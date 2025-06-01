# Collab-Draw

A collaborative drawing application similar to Excalidraw, built with modern web technologies. Multiple users can join rooms and draw shapes on a shared canvas in real-time.

## Features

- Real-time collaborative drawing
- Room-based collaboration
- User authentication
- Chat functionality within rooms
- Modern UI with Tailwind CSS
- Real-time updates using WebSocket

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: 
  - HTTP Server: Express.js
  - WebSocket Server: Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Build System**: Turborepo
- **Package Manager**: pnpm

## Project Structure

```
collab-draw/
├── apps/
│   ├── web/              # Frontend React application
│   ├── http-backend/     # Express.js HTTP server
│   └── ws-backend/       # WebSocket server
├── packages/
│   ├── db/              # Database configuration and Prisma schema
│   ├── ui/              # Shared UI components
│   ├── common/          # Shared utilities and types
│   ├── backend-common/  # Backend shared code
│   ├── eslint-config/   # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
```

## Prerequisites

- Node.js (v16 or higher)
- pnpm
- Docker and Docker Compose
- PostgreSQL

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/iamNIKHIL-dotcom/collab-draw.git
   cd collab-draw
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in each app and package directory
   - Update the variables with your configuration

4. Start the development environment:
   ```bash
   pnpm dev
   ```

## Docker Setup

The project includes Docker Compose configuration for easy deployment. To start the application using Docker:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- HTTP backend server
- WebSocket server
- Frontend application

## Development

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm lint` - Run linting
- `pnpm test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
