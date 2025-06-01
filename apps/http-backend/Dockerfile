FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies and build
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

# Expose port
EXPOSE 3001

# Start the app
CMD ["pnpm", "start"] 