FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies and build
RUN npm install -g pnpm
RUN pnpm install

# Increase Node.js memory limit for build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"] 